export interface TnQLCathi {
    id?: number;
    donvi_id: number;
    form_id: number;
    test_num: number;
    time_start: string;
    time_late: number;
    time_start_format: string;
    process: number;
    name: string;
    user_id: number;
    status: number;
    process_check: number;
    student_check: string;
    type: string;
    elearning_class_id: number;
}
export const json_test =
    [
        {
            "question_type": "radio",
            "question_direction": "Choose One Correct Answer<br><i>Select the single best answer for each question.</i>",
            "answer_option": [],
            "answer_correct": "",
            "group_id": 0,
            "code": "Part-1",
            "media": null,
            "config": {
                "cols": 2,
                "invertedAnswer": true
            },
            "raw_answer": "",
            "children": [
                {
                    "question_type": "radio",
                    "question_number": 1,
                    "question_direction": "If I ________ you, I would take that job offer immediately.",
                    "answer_option": [
                        {
                            "id": "1",
                            "value": "am",
                            "isSelected": false
                        },
                        {
                            "id": "2",
                            "value": "was",
                            "isSelected": false
                        },
                        {
                            "id": "3",
                            "value": "were",
                            "isSelected": true
                        },
                        {
                            "id": "4",
                            "value": "had been",
                            "isSelected": false
                        }
                    ],
                    "answer_correct": "|3|",
                    "group_id": 0,
                    "code": "Part-1",
                    "media": null,
                    "config": {
                        "cols": 2,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Trắc nghiệm 1 đáp án",
                    "_text": "If I ________ you, I would take that job offer immediately.",
                    "_answers": [
                        {
                            "label": "A",
                            "text": "am",
                            "isCorrect": false
                        },
                        {
                            "label": "B",
                            "text": "was",
                            "isCorrect": false
                        },
                        {
                            "label": "C",
                            "text": "were",
                            "isCorrect": true
                        },
                        {
                            "label": "D",
                            "text": "had been",
                            "isCorrect": false
                        }
                    ],
                    "_correctAnswerLabel": "C",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết"
                },
                {
                    "question_type": "radio",
                    "question_number": 2,
                    "question_direction": "The movie was so ________ that I almost fell asleep in the middle.",
                    "answer_option": [
                        {
                            "id": "1",
                            "value": "bored",
                            "isSelected": false
                        },
                        {
                            "id": "2",
                            "value": "boring",
                            "isSelected": true
                        },
                        {
                            "id": "3",
                            "value": "boredom",
                            "isSelected": false
                        },
                        {
                            "id": "4",
                            "value": "bore",
                            "isSelected": false
                        }
                    ],
                    "answer_correct": "|2|",
                    "group_id": 0,
                    "code": "Part-1",
                    "media": null,
                    "config": {
                        "cols": 2,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Trắc nghiệm 1 đáp án",
                    "_text": "The movie was so ________ that I almost fell asleep in the middle.",
                    "_answers": [
                        {
                            "label": "A",
                            "text": "bored",
                            "isCorrect": false
                        },
                        {
                            "label": "B",
                            "text": "boring",
                            "isCorrect": true
                        },
                        {
                            "label": "C",
                            "text": "boredom",
                            "isCorrect": false
                        },
                        {
                            "label": "D",
                            "text": "bore",
                            "isCorrect": false
                        }
                    ],
                    "_correctAnswerLabel": "B",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết"
                },
                {
                    "question_type": "radio",
                    "question_number": 3,
                    "question_direction": "She has been working here ________ 2015.",
                    "answer_option": [
                        {
                            "id": "1",
                            "value": "for",
                            "isSelected": false
                        },
                        {
                            "id": "2",
                            "value": "during",
                            "isSelected": false
                        },
                        {
                            "id": "3",
                            "value": "since",
                            "isSelected": true
                        },
                        {
                            "id": "4",
                            "value": "in",
                            "isSelected": false
                        }
                    ],
                    "answer_correct": "|3|",
                    "group_id": 0,
                    "code": "Part-1",
                    "media": null,
                    "config": {
                        "cols": 2,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Trắc nghiệm 1 đáp án",
                    "_text": "She has been working here ________ 2015.",
                    "_answers": [
                        {
                            "label": "A",
                            "text": "for",
                            "isCorrect": false
                        },
                        {
                            "label": "B",
                            "text": "during",
                            "isCorrect": false
                        },
                        {
                            "label": "C",
                            "text": "since",
                            "isCorrect": true
                        },
                        {
                            "label": "D",
                            "text": "in",
                            "isCorrect": false
                        }
                    ],
                    "_correctAnswerLabel": "C",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết"
                }
            ],
            "private": 0,
            "cdr": 1,
            "showCorrectAnswer": true,
            "_typeLabel": "Trắc nghiệm 1 đáp án",
            "_text": "Choose One Correct Answer<br><i>Select the single best answer for each question.</i>",
            "_answers": [],
            "_correctAnswerLabel": "",
            "_hasChildren": true,
            "_cdrLabel": "Biết",
            "title_part": "Part 1"
        },
        {
            "question_type": "inputbox",
            "question_direction": "Fill in the Blanks<br><i>Type the correct form of the word in brackets into the space provided.</i>",
            "answer_option": [],
            "answer_correct": "",
            "group_id": 0,
            "code": "Part-2",
            "media": null,
            "config": {
                "cols": 1,
                "invertedAnswer": true
            },
            "raw_answer": "",
            "children": [
                {
                    "question_type": "inputbox",
                    "question_number": 1,
                    "question_direction": "My brother is very [interest] __________ in learning how to play the guitar.",
                    "answer_option": [],
                    "answer_correct": "|interested|",
                    "group_id": 0,
                    "code": "Part-2",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Nhập liệu",
                    "_text": "My brother is very [interest] __________ in learning how to play the guitar.",
                    "_answers": [],
                    "_correctAnswerLabel": "INTERESTED",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "new_answer_correct": [
                        "interested"
                    ]
                },
                {
                    "question_type": "inputbox",
                    "question_number": 2,
                    "question_direction": "By the time we arrived at the station, the train [leave] __________ already.",
                    "answer_option": [],
                    "answer_correct": "|had left|",
                    "group_id": 0,
                    "code": "Part-2",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Nhập liệu",
                    "_text": "By the time we arrived at the station, the train [leave] __________ already.",
                    "_answers": [],
                    "_correctAnswerLabel": "HAD LEFT",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "new_answer_correct": [
                        "had left"
                    ]
                },
                {
                    "question_type": "inputbox",
                    "question_number": 3,
                    "question_direction": "Water [boil] __________ at 100 degrees Celsius.",
                    "answer_option": [],
                    "answer_correct": "|boils|",
                    "group_id": 0,
                    "code": "Part-2",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Nhập liệu",
                    "_text": "Water [boil] __________ at 100 degrees Celsius.",
                    "_answers": [],
                    "_correctAnswerLabel": "BOILS",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "new_answer_correct": [
                        "boils"
                    ]
                }
            ],
            "private": 0,
            "cdr": 1,
            "showCorrectAnswer": true,
            "_typeLabel": "Nhập liệu",
            "_text": "Fill in the Blanks<br><i>Type the correct form of the word in brackets into the space provided.</i>",
            "_answers": [],
            "_correctAnswerLabel": "",
            "_hasChildren": true,
            "_cdrLabel": "Biết",
            "title_part": "Part 2",
            "new_answer_correct": []
        },
        {
            "question_type": "drag_drop",
            "question_direction": "Matching<br><i>Match the words on the left with their definitions on the right.</i>",
            "answer_option": [
                {
                    "id": "1",
                    "value": "To make something appear larger than it is."
                },
                {
                    "id": "2",
                    "value": "Able to be maintained at a certain rate or level."
                },
                {
                    "id": "3",
                    "value": "Unwilling and hesitant; disinclined."
                },
                {
                    "id": "4",
                    "value": "A new method, idea, or product."
                }
            ],
            "answer_correct": "",
            "group_id": 0,
            "code": "Part-3",
            "media": null,
            "config": {
                "cols": 1,
                "invertedAnswer": true
            },
            "raw_answer": "",
            "children": [
                {
                    "question_type": "drag_drop",
                    "question_number": 1,
                    "question_direction": "Sustainable",
                    "answer_option": [],
                    "answer_correct": "|2|",
                    "group_id": 0,
                    "code": "Part-3",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Kéo thả",
                    "_text": "Sustainable",
                    "_answers": [],
                    "_correctAnswerLabel": "B",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "answer": [
                        {
                            "id": "2",
                            "value": "Able to be maintained at a certain rate or level."
                        }
                    ]
                },
                {
                    "question_type": "drag_drop",
                    "question_number": 2,
                    "question_direction": "Exaggerate",
                    "answer_option": [],
                    "answer_correct": "|1|",
                    "group_id": 0,
                    "code": "Part-3",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Kéo thả",
                    "_text": "Exaggerate",
                    "_answers": [],
                    "_correctAnswerLabel": "A",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "answer": [
                        {
                            "id": "1",
                            "value": "To make something appear larger than it is."
                        }
                    ]
                },
                {
                    "question_type": "drag_drop",
                    "question_number": 3,
                    "question_direction": "Reluctant",
                    "answer_option": [],
                    "answer_correct": "|3|",
                    "group_id": 0,
                    "code": "Part-3",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Kéo thả",
                    "_text": "Reluctant",
                    "_answers": [],
                    "_correctAnswerLabel": "C",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "answer": [
                        {
                            "id": "3",
                            "value": "Unwilling and hesitant; disinclined."
                        }
                    ]
                },
                {
                    "question_type": "drag_drop",
                    "question_number": 4,
                    "question_direction": "Innovation",
                    "answer_option": [],
                    "answer_correct": "|4|",
                    "group_id": 0,
                    "code": "Part-3",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Kéo thả",
                    "_text": "Innovation",
                    "_answers": [],
                    "_correctAnswerLabel": "D",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "answer": [
                        {
                            "id": "4",
                            "value": "A new method, idea, or product."
                        }
                    ]
                }
            ],
            "private": 0,
            "cdr": 1,
            "showCorrectAnswer": true,
            "_typeLabel": "Kéo thả",
            "_text": "Matching<br><i>Match the words on the left with their definitions on the right.</i>",
            "_answers": [
                {
                    "label": "A",
                    "text": "To make something appear larger than it is.",
                    "isCorrect": false
                },
                {
                    "label": "B",
                    "text": "Able to be maintained at a certain rate or level.",
                    "isCorrect": false
                },
                {
                    "label": "C",
                    "text": "Unwilling and hesitant; disinclined.",
                    "isCorrect": false
                },
                {
                    "label": "D",
                    "text": "A new method, idea, or product.",
                    "isCorrect": false
                }
            ],
            "_correctAnswerLabel": "",
            "_hasChildren": true,
            "_cdrLabel": "Biết",
            "title_part": "Part 3"
        },
        {
            "question_type": "reorder_words",
            "question_direction": "Sentence Building<br><i>Put the words in the correct order to make a meaningful sentence.</i>",
            "answer_option": [],
            "answer_correct": "",
            "group_id": 0,
            "code": "Part-4",
            "media": null,
            "config": {
                "cols": 1,
                "invertedAnswer": true
            },
            "raw_answer": "",
            "children": [
                {
                    "question_type": "reorder_words",
                    "question_number": 1,
                    "question_direction": "last/went/we/to/the/cinema/night/.",
                    "answer_option": [],
                    "answer_correct": "|We went to the cinema last night.|",
                    "group_id": 0,
                    "code": "Part-4",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "last/went/we/to/the/cinema/night/.",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Sắp xếp từ",
                    "_text": "last/went/we/to/the/cinema/night/.",
                    "_answers": [],
                    "_correctAnswerLabel": "WE WENT TO THE CINEMA LAST NIGHT.",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "shuffledWords": [
                        "last",
                        "went",
                        "we",
                        "to",
                        "the",
                        "cinema",
                        "night",
                        "."
                    ],
                    "userSentence": [
                        "We went to the cinema last night."
                    ]
                },
                {
                    "question_type": "reorder_words",
                    "question_number": 2,
                    "question_direction": "English/important/is/it/learn/to/.",
                    "answer_option": [],
                    "answer_correct": "|It is important to learn English.|",
                    "group_id": 0,
                    "code": "Part-4",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "English/important/is/it/learn/to/.",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Sắp xếp từ",
                    "_text": "English/important/is/it/learn/to/.",
                    "_answers": [],
                    "_correctAnswerLabel": "IT IS IMPORTANT TO LEARN ENGLISH.",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "shuffledWords": [
                        "English",
                        "important",
                        "is",
                        "it",
                        "learn",
                        "to",
                        "."
                    ],
                    "userSentence": [
                        "It is important to learn English."
                    ]
                },
                {
                    "question_type": "reorder_words",
                    "question_number": 3,
                    "question_direction": "finished/she/has/homework/her/yet/?",
                    "answer_option": [],
                    "answer_correct": "|Has she finished her homework yet?|",
                    "group_id": 0,
                    "code": "Part-4",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "finished/she/has/homework/her/yet/?",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Sắp xếp từ",
                    "_text": "finished/she/has/homework/her/yet/?",
                    "_answers": [],
                    "_correctAnswerLabel": "HAS SHE FINISHED HER HOMEWORK YET?",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết",
                    "shuffledWords": [
                        "finished",
                        "she",
                        "has",
                        "homework",
                        "her",
                        "yet",
                        "?"
                    ],
                    "userSentence": [
                        "Has she finished her homework yet?"
                    ]
                }
            ],
            "private": 0,
            "cdr": 1,
            "showCorrectAnswer": true,
            "_typeLabel": "Sắp xếp từ",
            "_text": "Sentence Building<br><i>Put the words in the correct order to make a meaningful sentence.</i>",
            "_answers": [],
            "_correctAnswerLabel": "",
            "_hasChildren": true,
            "_cdrLabel": "Biết",
            "shuffledWords": [
                "Sentence Building<br><i>Put the words in the correct order to make a meaningful sentence.<",
                "i>"
            ],
            "userSentence": [],
            "title_part": "Part 4"
        },
        {
            "question_type": "arrange_paragraphs",
            "question_direction": "Cohesion and Logic<br><i>Order the following paragraphs (A-D) to form a complete story.</i>",
            "answer_option": [],
            "answer_correct": "",
            "group_id": 0,
            "code": "Part-5",
            "media": null,
            "config": {
                "cols": 1,
                "invertedAnswer": true
            },
            "raw_answer": "",
            "children": [
                {
                    "question_type": "arrange_paragraphs",
                    "question_number": 1,
                    "question_direction": "",
                    "answer_option": [
                        {
                            "id": "1",
                            "value": "Finally, after two hours of hiking, we reached the summit. The view of the valley below was breathtaking and made all the effort worthwhile."
                        },
                        {
                            "id": "2",
                            "value": "We started our journey early in the morning, just as the sun was beginning to rise. The air was crisp and cool as we packed our bags."
                        },
                        {
                            "id": "3",
                            "value": "Halfway up the mountain, we decided to take a short break near a small stream. We ate some sandwiches and drank some fresh water to regain our energy."
                        },
                        {
                            "id": "4",
                            "value": "We spent about an hour at the top taking photos and enjoying the silence before we began our long walk back down."
                        }
                    ],
                    "answer_correct": "|2,3,1,4|",
                    "group_id": 0,
                    "code": "Part-5",
                    "media": null,
                    "config": {
                        "cols": 1,
                        "invertedAnswer": true
                    },
                    "raw_answer": "",
                    "children": [],
                    "private": 0,
                    "cdr": 1,
                    "showCorrectAnswer": true,
                    "_typeLabel": "Sắp xếp đoạn",
                    "_text": "",
                    "_answers": [
                        {
                            "label": "A",
                            "text": "Finally, after two hours of hiking, we reached the summit. The view of the valley below was breathtaking and made all the effort worthwhile.",
                            "isCorrect": false
                        },
                        {
                            "label": "B",
                            "text": "We started our journey early in the morning, just as the sun was beginning to rise. The air was crisp and cool as we packed our bags.",
                            "isCorrect": false
                        },
                        {
                            "label": "C",
                            "text": "Halfway up the mountain, we decided to take a short break near a small stream. We ate some sandwiches and drank some fresh water to regain our energy.",
                            "isCorrect": false
                        },
                        {
                            "label": "D",
                            "text": "We spent about an hour at the top taking photos and enjoying the silence before we began our long walk back down.",
                            "isCorrect": false
                        }
                    ],
                    "_correctAnswerLabel": "B",
                    "_hasChildren": false,
                    "_cdrLabel": "Biết"
                }
            ],
            "private": 0,
            "cdr": 1,
            "showCorrectAnswer": true,
            "_typeLabel": "Sắp xếp đoạn",
            "_text": "Cohesion and Logic<br><i>Order the following paragraphs (A-D) to form a complete story.</i>",
            "_answers": [],
            "_correctAnswerLabel": "",
            "_hasChildren": true,
            "_cdrLabel": "Biết",
            "title_part": "Part 5"
        }
    ]

export const monkhac = [
    {
        "question_type": "radio",
        "question_direction": "<p><strong>Đề bài:</strong> Tính tích phân suy rộng sau:</p><div class=\"math-block\" data-math=\"I = \\int_{1}^{+\\infty} \\frac{1}{x^2 + x} \\, dx\">I = \\int_{1}^{+\\infty} \\frac{1}{x^2 + x} \\, dx</div>",
        "answer_option": [
            {
                "id": "1",
                "value": "<span class=\"math-inline\" data-math=\"I = \\ln(2)\">I = \\ln(2)</span>"
            },
            {
                "id": "2",
                "value": "<span class=\"math-inline\" data-math=\"I = \\pi\">I = \\pi</span>"
            },
            {
                "id": "3",
                "value": "<span class=\"math-inline\" data-math=\"I = 1\">I = 1</span>"
            },
            {
                "id": "4",
                "value": "Tích phân phân kỳ."
            }
        ],
        "answer_correct": "|1|",
        "group_id": 0,
        "config": {
            "cols": 2,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": []
    },
    {
        "question_type": "checkbox",
        "question_direction": "<p><strong>Đề bài:</strong> Cho ma trận vuông <span class=\"math-inline\" data-math=\"A\">A</span> cấp <span class=\"math-inline\" data-math=\"n\">n</span>. Những phát biểu nào sau đây tương đương với khẳng định \"<span class=\"math-inline\" data-math=\"A\">A</span> là ma trận khả nghịch\"?</p>",
        "answer_option": [
            {
                "id": "1",
                "value": "Khử Gauss đưa <span class=\"math-inline\" data-math=\"A\">A</span> về ma trận đơn vị <span class=\"math-inline\" data-math=\"I_n\">I_n</span>."
            },
            {
                "id": "2",
                "value": "Định thức của ma trận <span class=\"math-inline\" data-math=\"A\">A</span> bằng 0 (<span class=\"math-inline\" data-math=\"\\det(A) = 0\">\\det(A) = 0</span>)."
            },
            {
                "id": "3",
                "value": "Hệ phương trình thuần nhất <span class=\"math-inline\" data-math=\"Ax = 0\">Ax = 0</span> chỉ có nghiệm tầm thường <span class=\"math-inline\" data-math=\"x = 0\">x = 0</span>."
            },
            {
                "id": "4",
                "value": "Hạng của ma trận <span class=\"math-inline\" data-math=\"A\">A</span> nhỏ hơn <span class=\"math-inline\" data-math=\"n\">n</span> (<span class=\"math-inline\" data-math=\"\\text{rank}(A) < n\">\\text{rank}(A) < n</span>)."
            },
            {
                "id": "5",
                "value": "Các cột của ma trận <span class=\"math-inline\" data-math=\"A\">A</span> độc lập tuyến tính."
            }
        ],
        "answer_correct": "|1,3,5|",
        "group_id": 0,
        "config": {
            "cols": 2,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": []
    },
    {
        "question_type": "inputbox",
        "question_direction": "<p><strong>Đề bài:</strong> Tìm giá trị cực tiểu của hàm số hai biến <span class=\"math-inline\" data-math=\"z = x^2 + y^2 - 4x - 6y + 14\">z = x^2 + y^2 - 4x - 6y + 14</span>.</p>",
        "answer_option": [],
        "answer_correct": "|1|",
        "group_id": 0,
        "config": {
            "cols": 1,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": []
    },
    {
        "question_type": "grouping",
        "question_direction": "<p><strong>Đề bài:</strong> Hãy kéo các chuỗi số sau đây thả vào đúng nhóm <strong>Chuỗi hội tụ</strong> hoặc <strong>Chuỗi phân kỳ</strong>:</p>",
        "answer_option": [
            {
                "id": "1",
                "value": "<span class=\"math-inline\" data-math=\"\\sum_{n=1}^{\\infty} \\frac{1}{n}\">\\sum_{n=1}^{\\infty} \\frac{1}{n}</span>"
            },
            {
                "id": "2",
                "value": "<span class=\"math-inline\" data-math=\"\\sum_{n=1}^{\\infty} \\frac{1}{n^2}\">\\sum_{n=1}^{\\infty} \\frac{1}{n^2}</span>"
            },
            {
                "id": "3",
                "value": "<span class=\"math-inline\" data-math=\"\\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n\">\\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n</span>"
            },
            {
                "id": "4",
                "value": "<span class=\"math-inline\" data-math=\"\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}\">\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}</span>"
            },
            {
                "id": "5",
                "value": "<span class=\"math-inline\" data-math=\"\\sum_{n=1}^{\\infty} \\frac{n+1}{n}\">\\sum_{n=1}^{\\infty} \\frac{n+1}{n}</span>"
            }
        ],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 1,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_direction": "Chuỗi hội tụ",
                "answer_option": [],
                "answer_correct": "|2;3;4|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_direction": "Chuỗi phân kỳ",
                "answer_option": [],
                "answer_correct": "|1;5|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            }
        ]
    },
    {
        "question_type": "drag_drop",
        "question_direction": "<p><strong>Đề bài:</strong> Kéo các từ/cụm từ cho sẵn thả vào chỗ trống thích hợp để hoàn thiện <strong>Định lý Giá trị Trung bình (Lagrange)</strong>:</p><p>\"Nếu hàm số <span class=\"math-inline\" data-math=\"f(x)\">f(x)</span> [ (1) ] trên đoạn <span class=\"math-inline\" data-math=\"[a, b]\">[a, b]</span> và [ (2) ] trên khoảng <span class=\"math-inline\" data-math=\"(a, b)\">(a, b)</span> thì tồn tại ít nhất một điểm <span class=\"math-inline\" data-math=\"c \\in (a, b)\">c \\in (a, b)</span> sao cho <span class=\"math-inline\" data-math=\"f'(c) = [ (3) ]\">f'(c) = [ (3) ]</span>.\"</p>",
        "answer_option": [
            {
                "id": "1",
                "value": "khả vi"
            },
            {
                "id": "2",
                "value": "liên tục"
            },
            {
                "id": "3",
                "value": "\\frac{f(b) - f(a)}{b - a}"
            },
            {
                "id": "4",
                "value": "f(b) - f(a)"
            },
            {
                "id": "5",
                "value": "gián đoạn"
            }
        ],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 1,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_number": 1,
                "question_direction": "(1)",
                "answer_option": [],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 2,
                "question_direction": "(2)",
                "answer_option": [],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 3,
                "question_direction": "(3)",
                "answer_option": [],
                "answer_correct": "|3|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            }
        ]
    },
    {
        "question_type": "group-radio",
        "question_direction": "<p><strong>Đề bài:</strong> Xét phương trình vi phân sau: <span class=\"math-inline\" data-math=\"y'' - 3y' + 2y = e^{3x}\">y'' - 3y' + 2y = e^{3x}</span>. Hãy chọn đúng/sai cho các khẳng định dưới đây:</p>",
        "answer_option": [
            {
                "id": "1",
                "value": "Đúng"
            },
            {
                "id": "2",
                "value": "Sai"
            }
        ],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 2,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_number": 1,
                "question_direction": "Phương trình thuần nhất tương ứng có nghiệm tổng quát là <span class=\"math-inline\" data-math=\"y_0 = C_1e^x + C_2e^{2x}\">y_0 = C_1e^x + C_2e^{2x}</span>.",
                "answer_option": [
                    {
                        "id": "1",
                        "value": "Đúng"
                    },
                    {
                        "id": "2",
                        "value": "Sai"
                    }
                ],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 2,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 2,
                "question_direction": "Nghiệm riêng <span class=\"math-inline\" data-math=\"y^*\">y^*</span> của phương trình có dạng tìm kiếm là <span class=\"math-inline\" data-math=\"Ax \\cdot e^{3x}\">Ax \\cdot e^{3x}</span>.",
                "answer_option": [
                    {
                        "id": "1",
                        "value": "Đúng"
                    },
                    {
                        "id": "2",
                        "value": "Sai"
                    }
                ],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 2,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 3,
                "question_direction": "Nghiệm tổng quát của phương trình đã cho là <span class=\"math-inline\" data-math=\"y = C_1e^x + C_2e^{2x} + \\frac{1}{2}e^{3x}\">y = C_1e^x + C_2e^{2x} + \\frac{1}{2}e^{3x}</span>.",
                "answer_option": [
                    {
                        "id": "1",
                        "value": "Đúng"
                    },
                    {
                        "id": "2",
                        "value": "Sai"
                    }
                ],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 2,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            }
        ]
    },
    {
        "question_type": "group-input",
        "question_direction": "<p><strong>Đề bài:</strong> Cho không gian vectơ <span class=\"math-inline\" data-math=\"\\mathbb{R}^3\">\\mathbb{R}^3</span> và ánh xạ tuyến tính <span class=\"math-inline\" data-math=\"f: \\mathbb{R}^3 \\to \\mathbb{R}^2\">f: \\mathbb{R}^3 \\to \\mathbb{R}^2</span> được xác định bởi công thức:</p><div class=\"math-block\" data-math=\"f(x, y, z) = (x + 2y - z, \\; 2x - y + 3z)\">f(x, y, z) = (x + 2y - z, \\; 2x - y + 3z)</div><p>Hãy xác định ma trận <span class=\"math-inline\" data-math=\"A\">A</span> của ánh xạ tuyến tính <span class=\"math-inline\" data-math=\"f\">f</span> đối với cặp cơ sở chính tắc của <span class=\"math-inline\" data-math=\"\\mathbb{R}^3\">\\mathbb{R}^3</span> và <span class=\"math-inline\" data-math=\"\\mathbb{R}^2\">\\mathbb{R}^2</span>.</p><p><strong>Ma trận trực quan:</strong></p><div class=\"math-block\" data-math=\"A = \\begin{pmatrix} [ \\text{Ô 1} ] & [ \\text{Ô 2} ] & [ \\text{Ô 3} ] \\\\ [ \\text{Ô 4} ] & [ \\text{Ô 5} ] & [ \\text{Ô 6} ] \\end{pmatrix}\">A = \\begin{pmatrix} [ \\text{Ô 1} ] & [ \\text{Ô 2} ] & [ \\text{Ô 3} ] \\\\ [ \\text{Ô 4} ] & [ \\text{Ô 5} ] & [ \\text{Ô 6} ] \\end{pmatrix}</div>",
        "answer_option": [],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 2,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_number": 1,
                "question_direction": "Ô nhập (1,1) / Ô 1",
                "answer_option": [],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 2,
                "question_direction": "Ô nhập (1,2) / Ô 2",
                "answer_option": [],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 3,
                "question_direction": "Ô nhập (1,3) / Ô 3",
                "answer_option": [],
                "answer_correct": "|-1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 4,
                "question_direction": "Ô nhập (2,1) / Ô 4",
                "answer_option": [],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 5,
                "question_direction": "Ô nhập (2,2) / Ô 5",
                "answer_option": [],
                "answer_correct": "|-1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            },
            {
                "question_number": 6,
                "question_direction": "Ô nhập (2,3) / Ô 6",
                "answer_option": [],
                "answer_correct": "|3|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": []
            }
        ]
    }
]

export const cauhoi_khac = [
    {
        "question_type": "radio",
        "question_direction": "Tính tích phân suy rộng sau:<div class=\"math-block\"><span class=\"latex-ictu-img\" data-latex=\"I = \\int_{1}^{+\\infty} \\frac{1}{x^2 + x} \\, dx\"><img src=\"assets/images/image-loading-2.gif\"></span>&nbsp;</div>",
        "answer_option": [
            {
                "id": "1",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"I = \\ln(2)\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isSelected": true
            },
            {
                "id": "2",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"I = \\pi\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isSelected": false
            },
            {
                "id": "3",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"I = 1\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isSelected": false
            },
            {
                "id": "4",
                "value": "Tích phân phân kỳ.",
                "isSelected": false
            }
        ],
        "answer_correct": "|1|",
        "group_id": 0,
        "config": {
            "cols": 2,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [],
        "private": 0,
        "cdr": 1,
        "showCorrectAnswer": true,
        "_typeLabel": "Trắc nghiệm 1 đáp án",
        "_text": "Tính tích phân suy rộng sau:<div class=\"math-block\"><span class=\"latex-ictu-img\" data-latex=\"I = \\int_{1}^{+\\infty} \\frac{1}{x^2 + x} \\, dx\"><img src=\"assets/images/image-loading-2.gif\"></span>&nbsp;</div>",
        "_answers": [
            {
                "label": "A",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"I = \\ln(2)\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": true
            },
            {
                "label": "B",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"I = \\pi\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            },
            {
                "label": "C",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"I = 1\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            },
            {
                "label": "D",
                "text": "Tích phân phân kỳ.",
                "isCorrect": false
            }
        ],
        "_correctAnswerLabel": "A",
        "_hasChildren": false,
        "_cdrLabel": "Biết",
        "title_part": ""
    },
    {
        "question_type": "checkbox",
        "question_direction": "Cho ma trận vuông <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> cấp <span class=\"latex-ictu-img\" data-latex=\"n\"><img src=\"assets/images/image-loading-2.gif\"></span>. Những phát biểu nào sau đây tương đương với khẳng định \"<span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> là ma trận khả nghịch\"?",
        "answer_option": [
            {
                "id": "1",
                "value": "Khử Gauss đưa <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> về ma trận đơn vị <span class=\"latex-ictu-img\" data-latex=\"I_n\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "isSelected": true
            },
            {
                "id": "2",
                "value": "Định thức của ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> bằng 0 (<span class=\"latex-ictu-img\" data-latex=\"\\det(A) = 0\"><img src=\"assets/images/image-loading-2.gif\"></span>).",
                "isSelected": false
            },
            {
                "id": "3",
                "value": "Hệ phương trình thuần nhất <span class=\"latex-ictu-img\" data-latex=\"Ax = 0\"><img src=\"assets/images/image-loading-2.gif\"></span> chỉ có nghiệm tầm thường <span class=\"latex-ictu-img\" data-latex=\"x = 0\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "isSelected": true
            },
            {
                "id": "4",
                "value": "Hạng của ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> nhỏ hơn <span class=\"latex-ictu-img\" data-latex=\"n\"><img src=\"assets/images/image-loading-2.gif\"></span> (<span class=\"latex-ictu-img\" data-latex=\"\\text{rank}(A) &lt; n\"><img src=\"assets/images/image-loading-2.gif\"></span>).",
                "isSelected": false
            },
            {
                "id": "5",
                "value": "Các cột của ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> độc lập tuyến tính.",
                "isSelected": true
            }
        ],
        "answer_correct": "|1,3,5|",
        "group_id": 0,
        "config": {
            "cols": 2,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [],
        "private": 0,
        "cdr": 1,
        "showCorrectAnswer": true,
        "_typeLabel": "Trắc nghiệm nhiều đáp án",
        "_text": "Cho ma trận vuông <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> cấp <span class=\"latex-ictu-img\" data-latex=\"n\"><img src=\"assets/images/image-loading-2.gif\"></span>. Những phát biểu nào sau đây tương đương với khẳng định \"<span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> là ma trận khả nghịch\"?",
        "_answers": [
            {
                "label": "A",
                "text": "Khử Gauss đưa <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> về ma trận đơn vị <span class=\"latex-ictu-img\" data-latex=\"I_n\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "isCorrect": false
            },
            {
                "label": "B",
                "text": "Định thức của ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> bằng 0 (<span class=\"latex-ictu-img\" data-latex=\"\\det(A) = 0\"><img src=\"assets/images/image-loading-2.gif\"></span>).",
                "isCorrect": false
            },
            {
                "label": "C",
                "text": "Hệ phương trình thuần nhất <span class=\"latex-ictu-img\" data-latex=\"Ax = 0\"><img src=\"assets/images/image-loading-2.gif\"></span> chỉ có nghiệm tầm thường <span class=\"latex-ictu-img\" data-latex=\"x = 0\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "isCorrect": false
            },
            {
                "label": "D",
                "text": "Hạng của ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> nhỏ hơn <span class=\"latex-ictu-img\" data-latex=\"n\"><img src=\"assets/images/image-loading-2.gif\"></span> (<span class=\"latex-ictu-img\" data-latex=\"\\text{rank}(A) &lt; n\"><img src=\"assets/images/image-loading-2.gif\"></span>).",
                "isCorrect": false
            },
            {
                "label": "E",
                "text": "Các cột của ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> độc lập tuyến tính.",
                "isCorrect": false
            }
        ],
        "_correctAnswerLabel": "A",
        "_hasChildren": false,
        "_cdrLabel": "Biết",
        "title_part": ""
    },
    {
        "question_type": "inputbox",
        "question_direction": "Tìm giá trị cực tiểu của hàm số hai biến <span class=\"latex-ictu-img\" data-latex=\"z = x^2 + y^2 - 4x - 6y + 14\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
        "answer_option": [],
        "answer_correct": "|1|",
        "group_id": 0,
        "config": {
            "cols": 1,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [],
        "private": 0,
        "cdr": 1,
        "showCorrectAnswer": true,
        "_typeLabel": "Nhập liệu",
        "_text": "Tìm giá trị cực tiểu của hàm số hai biến <span class=\"latex-ictu-img\" data-latex=\"z = x^2 + y^2 - 4x - 6y + 14\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
        "_answers": [],
        "_correctAnswerLabel": "A",
        "_hasChildren": false,
        "_cdrLabel": "Biết",
        "title_part": "",
        "new_answer_correct": [
            "1"
        ]
    },
    {
        "question_type": "grouping",
        "question_direction": "Hãy kéo các chuỗi số sau đây thả vào đúng nhóm <strong>Chuỗi hội tụ</strong> hoặc <strong>Chuỗi phân kỳ</strong>:",
        "answer_option": [
            {
                "id": "1",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{1}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
            },
            {
                "id": "2",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{1}{n^2}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
            },
            {
                "id": "3",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n\"><img src=\"assets/images/image-loading-2.gif\"></span>"
            },
            {
                "id": "4",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
            },
            {
                "id": "5",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{n+1}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
            }
        ],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 1,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_number": 1,
                "question_type": "grouping",
                "question_direction": "Chuỗi hội tụ",
                "answer_option": [],
                "answer_correct": "|2;3;4|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhóm ghép cặp",
                "_text": "Chuỗi hội tụ",
                "_answers": [],
                "_correctAnswerLabel": "B",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "answer": [
                    {
                        "id": "4",
                        "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
                    },
                    {
                        "id": "2",
                        "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{1}{n^2}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
                    },
                    {
                        "id": "3",
                        "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n\"><img src=\"assets/images/image-loading-2.gif\"></span>"
                    }
                ]
            },
            {
                "question_number": 2,
                "question_type": "grouping",
                "question_direction": "Chuỗi phân kỳ",
                "answer_option": [],
                "answer_correct": "|1;5|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhóm ghép cặp",
                "_text": "Chuỗi phân kỳ",
                "_answers": [],
                "_correctAnswerLabel": "A",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "answer": [
                    {
                        "id": "1",
                        "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{1}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
                    },
                    {
                        "id": "5",
                        "value": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{n+1}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
                    }
                ]
            }
        ],
        "private": 0,
        "cdr": 1,
        "showCorrectAnswer": true,
        "_typeLabel": "Nhóm ghép cặp",
        "_text": "Hãy kéo các chuỗi số sau đây thả vào đúng nhóm <strong>Chuỗi hội tụ</strong> hoặc <strong>Chuỗi phân kỳ</strong>:",
        "_answers": [
            {
                "label": "A",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{1}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            },
            {
                "label": "B",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{1}{n^2}\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            },
            {
                "label": "C",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            },
            {
                "label": "D",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            },
            {
                "label": "E",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"\\sum_{n=1}^{\\infty} \\frac{n+1}{n}\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            }
        ],
        "_correctAnswerLabel": "",
        "_hasChildren": true,
        "_cdrLabel": "Biết",
        "dropListIds": [
            "pool",
            "drop-0",
            "drop-1"
        ],
        "title_part": ""
    },
    {
        "question_type": "drag_drop",
        "question_direction": "Kéo các từ/cụm từ cho sẵn thả vào chỗ trống thích hợp để hoàn thiện <strong>Định lý Giá trị Trung bình (Lagrange)</strong>:<br>\"Nếu hàm số <span class=\"latex-ictu-img\" data-latex=\"f(x)\"><img src=\"assets/images/image-loading-2.gif\"></span> [ (1) ] trên đoạn <span class=\"latex-ictu-img\" data-latex=\"[a, b]\"><img src=\"assets/images/image-loading-2.gif\"></span> và [ (2) ] trên khoảng <span class=\"latex-ictu-img\" data-latex=\"(a, b)\"><img src=\"assets/images/image-loading-2.gif\"></span> thì tồn tại ít nhất một điểm <span class=\"latex-ictu-img\" data-latex=\"c \\in (a, b)\"><img src=\"assets/images/image-loading-2.gif\"></span> sao cho <span class=\"latex-ictu-img\" data-latex=\"f'(c) = [ (3) ]\"><img src=\"assets/images/image-loading-2.gif\"></span>.\"",
        "answer_option": [
            {
                "id": "1",
                "value": "khả vi"
            },
            {
                "id": "2",
                "value": "liên tục"
            },
            {
                "id": "3",
                "value": "<span class=\"latex-ictu-img\" data-latex=\"\\frac{f(b) - f(a)}{b - a}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
            },
            {
                "id": "4",
                "value": "f(b) - f(a)"
            },
            {
                "id": "5",
                "value": "gián đoạn"
            }
        ],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 1,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_number": 1,
                "question_type": "drag_drop",
                "question_direction": "(1)",
                "answer_option": [],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Kéo thả",
                "_text": "(1)",
                "_answers": [],
                "_correctAnswerLabel": "B",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "answer": [
                    {
                        "id": "2",
                        "value": "liên tục"
                    }
                ]
            },
            {
                "question_number": 2,
                "question_type": "drag_drop",
                "question_direction": "(2)",
                "answer_option": [],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Kéo thả",
                "_text": "(2)",
                "_answers": [],
                "_correctAnswerLabel": "A",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "answer": [
                    {
                        "id": "1",
                        "value": "khả vi"
                    }
                ]
            },
            {
                "question_number": 3,
                "question_type": "drag_drop",
                "question_direction": "(3)",
                "answer_option": [],
                "answer_correct": "|3|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Kéo thả",
                "_text": "(3)",
                "_answers": [],
                "_correctAnswerLabel": "C",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "answer": [
                    {
                        "id": "3",
                        "value": "<span class=\"latex-ictu-img\" data-latex=\"\\frac{f(b) - f(a)}{b - a}\"><img src=\"assets/images/image-loading-2.gif\"></span>"
                    }
                ]
            }
        ],
        "private": 0,
        "cdr": 1,
        "showCorrectAnswer": true,
        "_typeLabel": "Kéo thả",
        "_text": "Kéo các từ/cụm từ cho sẵn thả vào chỗ trống thích hợp để hoàn thiện <strong>Định lý Giá trị Trung bình (Lagrange)</strong>:<br>\"Nếu hàm số <span class=\"latex-ictu-img\" data-latex=\"f(x)\"><img src=\"assets/images/image-loading-2.gif\"></span> [ (1) ] trên đoạn <span class=\"latex-ictu-img\" data-latex=\"[a, b]\"><img src=\"assets/images/image-loading-2.gif\"></span> và [ (2) ] trên khoảng <span class=\"latex-ictu-img\" data-latex=\"(a, b)\"><img src=\"assets/images/image-loading-2.gif\"></span> thì tồn tại ít nhất một điểm <span class=\"latex-ictu-img\" data-latex=\"c \\in (a, b)\"><img src=\"assets/images/image-loading-2.gif\"></span> sao cho <span class=\"latex-ictu-img\" data-latex=\"f'(c) = [ (3) ]\"><img src=\"assets/images/image-loading-2.gif\"></span>.\"",
        "_answers": [
            {
                "label": "A",
                "text": "khả vi",
                "isCorrect": false
            },
            {
                "label": "B",
                "text": "liên tục",
                "isCorrect": false
            },
            {
                "label": "C",
                "text": "<span class=\"latex-ictu-img\" data-latex=\"\\frac{f(b) - f(a)}{b - a}\"><img src=\"assets/images/image-loading-2.gif\"></span>",
                "isCorrect": false
            },
            {
                "label": "D",
                "text": "f(b) - f(a)",
                "isCorrect": false
            },
            {
                "label": "E",
                "text": "gián đoạn",
                "isCorrect": false
            }
        ],
        "_correctAnswerLabel": "",
        "_hasChildren": true,
        "_cdrLabel": "Biết",
        "title_part": ""
    },
    {
        "question_type": "group-radio",
        "question_direction": "Xét phương trình vi phân sau: <span class=\"latex-ictu-img\" data-latex=\"y'' - 3y' + 2y = e^{3x}\"><img src=\"assets/images/image-loading-2.gif\"></span>. Hãy chọn đúng/sai cho các khẳng định dưới đây:",
        "answer_option": [
            {
                "id": "1",
                "value": "Đúng"
            },
            {
                "id": "2",
                "value": "Sai"
            }
        ],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 2,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_number": 1,
                "question_type": "radio",
                "question_direction": "Phương trình thuần nhất tương ứng có nghiệm tổng quát là <span class=\"latex-ictu-img\" data-latex=\"y_0 = C_1e^x + C_2e^{2x}\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "answer_option": [
                    {
                        "id": "1",
                        "value": "Đúng",
                        "isSelected": true
                    },
                    {
                        "id": "2",
                        "value": "Sai",
                        "isSelected": false
                    }
                ],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 2,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Trắc nghiệm 1 đáp án",
                "_text": "Phương trình thuần nhất tương ứng có nghiệm tổng quát là <span class=\"latex-ictu-img\" data-latex=\"y_0 = C_1e^x + C_2e^{2x}\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "_answers": [
                    {
                        "label": "A",
                        "text": "Đúng",
                        "isCorrect": true
                    },
                    {
                        "label": "B",
                        "text": "Sai",
                        "isCorrect": false
                    }
                ],
                "_correctAnswerLabel": "A",
                "_hasChildren": false,
                "_cdrLabel": "Biết"
            },
            {
                "question_number": 2,
                "question_type": "radio",
                "question_direction": "Nghiệm riêng <span class=\"latex-ictu-img\" data-latex=\"y^*\"><img src=\"assets/images/image-loading-2.gif\"></span> của phương trình có dạng tìm kiếm là <span class=\"latex-ictu-img\" data-latex=\"Ax \\cdot e^{3x}\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "answer_option": [
                    {
                        "id": "1",
                        "value": "Đúng",
                        "isSelected": false
                    },
                    {
                        "id": "2",
                        "value": "Sai",
                        "isSelected": true
                    }
                ],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 2,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Trắc nghiệm 1 đáp án",
                "_text": "Nghiệm riêng <span class=\"latex-ictu-img\" data-latex=\"y^*\"><img src=\"assets/images/image-loading-2.gif\"></span> của phương trình có dạng tìm kiếm là <span class=\"latex-ictu-img\" data-latex=\"Ax \\cdot e^{3x}\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "_answers": [
                    {
                        "label": "A",
                        "text": "Đúng",
                        "isCorrect": false
                    },
                    {
                        "label": "B",
                        "text": "Sai",
                        "isCorrect": true
                    }
                ],
                "_correctAnswerLabel": "B",
                "_hasChildren": false,
                "_cdrLabel": "Biết"
            },
            {
                "question_number": 3,
                "question_type": "radio",
                "question_direction": "Nghiệm tổng quát của phương trình đã cho là <span class=\"latex-ictu-img\" data-latex=\"y = C_1e^x + C_2e^{2x} + \\frac{1}{2}e^{3x}\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "answer_option": [
                    {
                        "id": "1",
                        "value": "Đúng",
                        "isSelected": true
                    },
                    {
                        "id": "2",
                        "value": "Sai",
                        "isSelected": false
                    }
                ],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 2,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Trắc nghiệm 1 đáp án",
                "_text": "Nghiệm tổng quát của phương trình đã cho là <span class=\"latex-ictu-img\" data-latex=\"y = C_1e^x + C_2e^{2x} + \\frac{1}{2}e^{3x}\"><img src=\"assets/images/image-loading-2.gif\"></span>.",
                "_answers": [
                    {
                        "label": "A",
                        "text": "Đúng",
                        "isCorrect": true
                    },
                    {
                        "label": "B",
                        "text": "Sai",
                        "isCorrect": false
                    }
                ],
                "_correctAnswerLabel": "A",
                "_hasChildren": false,
                "_cdrLabel": "Biết"
            }
        ],
        "private": 0,
        "cdr": 1,
        "showCorrectAnswer": true,
        "_typeLabel": "Nhóm trắc nghiệm",
        "_text": "Xét phương trình vi phân sau: <span class=\"latex-ictu-img\" data-latex=\"y'' - 3y' + 2y = e^{3x}\"><img src=\"assets/images/image-loading-2.gif\"></span>. Hãy chọn đúng/sai cho các khẳng định dưới đây:",
        "_answers": [
            {
                "label": "A",
                "text": "Đúng",
                "isCorrect": false
            },
            {
                "label": "B",
                "text": "Sai",
                "isCorrect": false
            }
        ],
        "_correctAnswerLabel": "",
        "_hasChildren": true,
        "_cdrLabel": "Biết",
        "title_part": ""
    },
    {
        "question_type": "group-input",
        "question_direction": "Cho không gian vectơ <span class=\"latex-ictu-img\" data-latex=\"\\mathbb{R}^3\"><img src=\"assets/images/image-loading-2.gif\"></span> và ánh xạ tuyến tính <span class=\"latex-ictu-img\" data-latex=\"f: \\mathbb{R}^3 \\to \\mathbb{R}^2\"><img src=\"assets/images/image-loading-2.gif\"></span> được xác định bởi công thức:<div class=\"math-block\"><span class=\"latex-ictu-img\" data-latex=\"f(x, y, z) = (x + 2y - z, \\; 2x - y + 3z)\"><img src=\"assets/images/image-loading-2.gif\"></span>&nbsp;</div>Hãy xác định ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> của ánh xạ tuyến tính <span class=\"latex-ictu-img\" data-latex=\"f\"><img src=\"assets/images/image-loading-2.gif\"></span> đối với cặp cơ sở chính tắc của <span class=\"latex-ictu-img\" data-latex=\"\\mathbb{R}^3\"><img src=\"assets/images/image-loading-2.gif\"></span> và <span class=\"latex-ictu-img\" data-latex=\"\\mathbb{R}^2\"><img src=\"assets/images/image-loading-2.gif\"></span>.<br><strong>Ma trận trực quan:</strong><div class=\"math-block\"><span class=\"latex-ictu-img\" data-latex=\"A = \\begin{pmatrix} [ \\text{Ô 1} ] &amp; [ \\text{Ô 2} ] &amp; [ \\text{Ô 3} ] \\\\ [ \\text{Ô 4} ] &amp; [ \\text{Ô 5} ] &amp; [ \\text{Ô 6} ] \\end{pmatrix}\"><img src=\"assets/images/image-loading-2.gif\"></span>&nbsp;</div>",
        "answer_option": [],
        "answer_correct": "",
        "group_id": 0,
        "config": {
            "cols": 1,
            "invertedAnswer": true
        },
        "raw_answer": "",
        "children": [
            {
                "question_number": 1,
                "question_type": "inputbox",
                "question_direction": "Ô nhập (1,1) / Ô 1",
                "answer_option": [],
                "answer_correct": "|1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhập liệu",
                "_text": "Ô nhập (1,1) / Ô 1",
                "_answers": [],
                "_correctAnswerLabel": "A",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "new_answer_correct": [
                    "1"
                ]
            },
            {
                "question_number": 2,
                "question_type": "inputbox",
                "question_direction": "Ô nhập (1,2) / Ô 2",
                "answer_option": [],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhập liệu",
                "_text": "Ô nhập (1,2) / Ô 2",
                "_answers": [],
                "_correctAnswerLabel": "B",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "new_answer_correct": [
                    "2"
                ]
            },
            {
                "question_number": 3,
                "question_type": "inputbox",
                "question_direction": "Ô nhập (1,3) / Ô 3",
                "answer_option": [],
                "answer_correct": "|-1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhập liệu",
                "_text": "Ô nhập (1,3) / Ô 3",
                "_answers": [],
                "_correctAnswerLabel": "?",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "new_answer_correct": [
                    "-1"
                ]
            },
            {
                "question_number": 4,
                "question_type": "inputbox",
                "question_direction": "Ô nhập (2,1) / Ô 4",
                "answer_option": [],
                "answer_correct": "|2|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhập liệu",
                "_text": "Ô nhập (2,1) / Ô 4",
                "_answers": [],
                "_correctAnswerLabel": "B",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "new_answer_correct": [
                    "2"
                ]
            },
            {
                "question_number": 5,
                "question_type": "inputbox",
                "question_direction": "Ô nhập (2,2) / Ô 5",
                "answer_option": [],
                "answer_correct": "|-1|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhập liệu",
                "_text": "Ô nhập (2,2) / Ô 5",
                "_answers": [],
                "_correctAnswerLabel": "?",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "new_answer_correct": [
                    "-1"
                ]
            },
            {
                "question_number": 6,
                "question_type": "inputbox",
                "question_direction": "Ô nhập (2,3) / Ô 6",
                "answer_option": [],
                "answer_correct": "|3|",
                "group_id": 0,
                "config": {
                    "cols": 1,
                    "invertedAnswer": true
                },
                "raw_answer": "",
                "children": [],
                "private": 0,
                "cdr": 1,
                "showCorrectAnswer": true,
                "_typeLabel": "Nhập liệu",
                "_text": "Ô nhập (2,3) / Ô 6",
                "_answers": [],
                "_correctAnswerLabel": "C",
                "_hasChildren": false,
                "_cdrLabel": "Biết",
                "new_answer_correct": [
                    "3"
                ]
            }
        ],
        "private": 0,
        "cdr": 1,
        "showCorrectAnswer": true,
        "_typeLabel": "Nhóm nhập liệu",
        "_text": "Cho không gian vectơ <span class=\"latex-ictu-img\" data-latex=\"\\mathbb{R}^3\"><img src=\"assets/images/image-loading-2.gif\"></span> và ánh xạ tuyến tính <span class=\"latex-ictu-img\" data-latex=\"f: \\mathbb{R}^3 \\to \\mathbb{R}^2\"><img src=\"assets/images/image-loading-2.gif\"></span> được xác định bởi công thức:<div class=\"math-block\"><span class=\"latex-ictu-img\" data-latex=\"f(x, y, z) = (x + 2y - z, \\; 2x - y + 3z)\"><img src=\"assets/images/image-loading-2.gif\"></span>&nbsp;</div>Hãy xác định ma trận <span class=\"latex-ictu-img\" data-latex=\"A\"><img src=\"assets/images/image-loading-2.gif\"></span> của ánh xạ tuyến tính <span class=\"latex-ictu-img\" data-latex=\"f\"><img src=\"assets/images/image-loading-2.gif\"></span> đối với cặp cơ sở chính tắc của <span class=\"latex-ictu-img\" data-latex=\"\\mathbb{R}^3\"><img src=\"assets/images/image-loading-2.gif\"></span> và <span class=\"latex-ictu-img\" data-latex=\"\\mathbb{R}^2\"><img src=\"assets/images/image-loading-2.gif\"></span>.<br><strong>Ma trận trực quan:</strong><div class=\"math-block\"><span class=\"latex-ictu-img\" data-latex=\"A = \\begin{pmatrix} [ \\text{Ô 1} ] &amp; [ \\text{Ô 2} ] &amp; [ \\text{Ô 3} ] \\\\ [ \\text{Ô 4} ] &amp; [ \\text{Ô 5} ] &amp; [ \\text{Ô 6} ] \\end{pmatrix}\"><img src=\"assets/images/image-loading-2.gif\"></span>&nbsp;</div>",
        "_answers": [],
        "_correctAnswerLabel": "",
        "_hasChildren": true,
        "_cdrLabel": "Biết",
        "title_part": ""
    }
]