import { Component , computed , inject , OnDestroy , OnInit , Signal , signal , WritableSignal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormControl , FormGroup , ReactiveFormsModule , Validators } from '@angular/forms';
import { Subject , takeUntil } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { MatButton } from '@angular/material/button';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { AppState } from '@models/app-state';
import { User } from '@models/user';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { UserService } from '@services/user.service';
import { IctuImageResizeComponent , ImageResizerConfig , ImageResizerDto } from '@components/ictu-image-resize/ictu-image-resize.component';
import { MatDialog , MatDialogRef } from '@angular/material/dialog';

@Component( {
	selector    : 'app-info' ,
	imports     : [ LoadingProgressComponent , InputText , MatButton , ReactiveFormsModule , NgOptimizedImage ] ,
	templateUrl : './info.component.html' ,
	styleUrl    : './info.component.css'
} )
export default class InfoComponent implements OnInit , OnDestroy {
	private readonly auth : AuthenticationService = inject( AuthenticationService );
	private readonly userService : UserService = inject( UserService );
	private readonly notificationService : NotificationService = inject( NotificationService );
	private readonly dialog : MatDialog = inject( MatDialog );
	private readonly destroy$ : Subject<void> = new Subject<void>();
	readonly state : WritableSignal<AppState> = signal<AppState>( 'success' );
	readonly user : WritableSignal<User> = signal<User>( this.auth.user );
	readonly avatar : Signal<string> = computed( () : string => this.user()?.avatar || 'assets/images/user/avatar-2.jpg' );
	readonly userForm : FormGroup = new FormGroup( { display_name : new FormControl( this.auth.user?.display_name , [ Validators.required , Validators.minLength( 3 ) , Validators.maxLength( 200 ) ] ) } );
	loading : boolean = false;

	constructor () {
		this.auth.onUserSetup.pipe( takeUntil( this.destroy$ ) ).subscribe( ( user : User ) : void => this.user.set( user ) );
	}

	ngOnInit () : void {}

	public btnUploadAvatar () : void {
		const inputFile : HTMLInputElement = Object.assign<HTMLInputElement , any>( document.createElement<'input'>( 'input' ) , { type : 'file' , accept : 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon' } );
		inputFile.onchange = () : void => {
			if ( inputFile.files?.length ) {
				const file : File = inputFile.files[ 0 ];
				if ( ! [ 'png' , 'jpeg' , 'jpg' , 'webp' ].includes( file.name.split( '.' ).pop()?.toLowerCase() || '' ) ) this.notificationService.toastError( 'Hệ thống chỉ chấp nhận file có phần mở rộng là jpg, jpeg, png, webp' , 'Lỗi định dạng file' );
				else if ( file.size / ( 1024 * 1024 ) > 10 ) this.notificationService.toastError( 'Dung lượng file upload không được vượt quá 10Mb!' , 'Lỗi dung lượng file' );
				else void this.makeAvatar( file );
			}
			inputFile.remove();
		};
		inputFile.click();
	}

	private async makeAvatar ( file : File ) : Promise<void> {
		const data : Partial<ImageResizerConfig> = { resizeToWidth : 200 , aspectRatio : 1 , format : 'png' , dataUrl : URL.createObjectURL( file ) };
		const dialogRef : MatDialogRef<IctuImageResizeComponent> = this.dialog.open( IctuImageResizeComponent , { data , disableClose : true , panelClass : 'image-resizer-panel' } );
		const result : ImageResizerDto = await dialogRef.afterClosed().toPromise();
		if ( result?.error ) return;
		const resizedFile : File = this.auth.helper.blobToFile( result.data.blob , `user-avatar-${ this.auth.user.id }-${ Date.now() }.png` );
		this.loading = true;
		this.auth.updateAvatar( resizedFile ).pipe( takeUntil( this.destroy$ ) ).subscribe( {
			next  : () : void => { this.loading = false; this.notificationService.toastSuccess( 'Cập nhật avatar thành công' ); },
			error : () : void => { this.loading = false; this.notificationService.toastError( 'Cập nhật avatar thất bại' ); }
		} );
	}

	public btnSubmitForm () : void {
		this.loading = true;
		this.userService.update( { display_name : this.userForm.value.display_name } ).pipe( takeUntil( this.destroy$ ) ).subscribe( {
			next  : () : void => { this.loading = false; this.auth.saveUser( { ... this.auth.user , display_name : this.userForm.value.display_name } ); },
			error : () : void => { this.loading = false; }
		} );
	}

	ngOnDestroy () : void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}