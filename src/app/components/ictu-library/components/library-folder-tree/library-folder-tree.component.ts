import { Component , input , InputSignal , model , ModelSignal , OnDestroy , output , OutputEmitterRef , signal , WritableSignal } from '@angular/core';
import { debounceTime , Subject } from 'rxjs';
import { IctuLibraryFolder } from '@components/ictu-library/ictu-library.component';
import { IlFilterRootFolderPipe } from '@components/ictu-library/pipes/il-filter-root-folder.pipe';
import { IlIsFolderHasChildPipe } from '@components/ictu-library/pipes/il-is-folder-has-child.pipe';
import { IlIsFolderOpenedPipe } from '@components/ictu-library/pipes/il-is-folder-opened.pipe';
import { CollapsePanelComponent } from '@theme/components/collapse-panel.component';
import { IlFilterChildrenFoldersPipe } from '@components/ictu-library/pipes/il-filter-children-folders.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs/operators';
import { map as _map } from 'lodash-es';
import { NgTemplateOutlet } from '@angular/common';

interface ToggleMenuEvent {
	session : number;
	item : IctuLibraryFolder;
	togglePanel : CollapsePanelComponent;
}

// export type LibraryFolderTreeMenuContextEventName = 'DELETE_FOLDER' | 'RENAME_FOLDER' | 'CREATE_CHILD_FOLDER' | 'UPLOAD_TO_FOLDER';
//
// export interface LibraryFolderTreeMenuContextEvent {
// 	name : LibraryFolderTreeMenuContextEventName,
// 	item : IctuLibraryFolder;
// 	session : number;
// }

@Component( {
	selector    : 'app-library-folder-tree' ,
	standalone  : true ,
	imports     : [ IlFilterRootFolderPipe , IlIsFolderHasChildPipe , IlIsFolderOpenedPipe , CollapsePanelComponent , IlFilterChildrenFoldersPipe , NgTemplateOutlet ] ,
	templateUrl : './library-folder-tree.component.html' ,
	styleUrl    : './library-folder-tree.component.css'
} )
export class LibraryFolderTreeComponent implements OnDestroy {
	
	// ── Input ──
	
	depth : InputSignal<number> = input.required();
	
	userId : InputSignal<number> = input.required();
	
	folders : ModelSignal<IctuLibraryFolder[]> = model.required<IctuLibraryFolder[]>();
	
	activeFolder : ModelSignal<IctuLibraryFolder> = model<IctuLibraryFolder>();
	
	// ── Output ──
	
	// treeMenuContextEvent : OutputEmitterRef<LibraryFolderTreeMenuContextEvent> = output<LibraryFolderTreeMenuContextEvent>();
	
	folderSelect : OutputEmitterRef<number> = output<number>();
	
	// ── Describe class attributes ──
	
	private destroyed$ : Subject<void> = new Subject<void>();
	
	private toggleMenuObserver : Subject<ToggleMenuEvent> = new Subject<ToggleMenuEvent>();
	
	// private menuContextEventObserver : Subject<LibraryFolderTreeMenuContextEvent> = new Subject<LibraryFolderTreeMenuContextEvent>();
	
	private session : WritableSignal<number> = signal( 0 );
	
	constructor() {
		this.toggleMenuObserver.asObservable().pipe(
			takeUntilDestroyed() ,
			distinctUntilChanged( ( previous : ToggleMenuEvent , current : ToggleMenuEvent ) : boolean => previous?.session === current.session ) ,
			debounceTime( 100 )
		).subscribe( ( event : ToggleMenuEvent ) : void => {
			if ( event.togglePanel ) {
				if ( event.item.isOpened ) {
					event.togglePanel.panel.hide();
				} else {
					event.togglePanel.panel.show();
				}
			}
			this._toggleMenu( event.item );
		} );
		
		// this.menuContextEventObserver.asObservable().pipe(
		// 	takeUntilDestroyed() ,
		// 	distinctUntilChanged( ( previous : LibraryFolderTreeMenuContextEvent , current : LibraryFolderTreeMenuContextEvent ) : boolean => previous?.session === current.session ) ,
		// 	debounceTime( 100 )
		// ).subscribe( ( event : LibraryFolderTreeMenuContextEvent ) : void => {
		// 	this.triggerMenuContext( event );
		// } );
	}
	
	// private triggerMenuContext( event : LibraryFolderTreeMenuContextEvent ) : void {
	// 	this.treeMenuContextEvent.emit( event );
	// 	this.increaseSession();
	// }
	
	protected btnActiveMenu( folder : IctuLibraryFolder ) : void {
		if ( !this.activeFolder() || folder.id !== this.activeFolder().id ) {
			this.activeFolder.set( folder );
		}
	}
	
	protected btnToggleMenu( item : IctuLibraryFolder , togglePanel? : CollapsePanelComponent ) : void {
		this.toggleMenuObserver.next( { session : this.session() , item , togglePanel } );
	}
	
	private increaseSession() : void {
		this.session.update( ( n : number ) : number => 1 + n );
	}
	
	private _toggleMenu( item : IctuLibraryFolder ) : void {
		this.folders.update( ( menu : IctuLibraryFolder[] ) : IctuLibraryFolder[] => {
			return _map<IctuLibraryFolder , IctuLibraryFolder>( menu , ( menuItem : IctuLibraryFolder ) : IctuLibraryFolder => {
				menuItem.isOpened = menuItem.id === item.id ? !item.isOpened : menuItem.isOpened;
				return menuItem;
			} );
		} );
		this.increaseSession();
	}
	
	// protected btnContentEvent( item : IctuLibraryFolder , name : LibraryFolderTreeMenuContextEventName ) : void {
	// 	this.menuContextEventObserver.next( { item , name , session : this.session() } );
	// }
	
	ngOnDestroy() : void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
