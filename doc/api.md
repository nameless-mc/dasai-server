# API Document

## 質問群一覧取得 API

### リクエスト

```
GET /api/question_groups
```

### レスポンス

| param                         | type   | description      |
| ----------------------------- | ------ | ---------------- |
| questions                     | array  | 質問群情報の配列 |
| question_groups[].id          | number | 質問群 ID        |
| question_groups[].title       | string | タイトル         |
| question_groups[].description | string | 説明             |

```javascript
{
    question_groups: [
        {
            id: number,
            title: string,
            description: string
        },
        ...
    ]
}
```

## 質問群取得 API

### リクエスト

```
GET /api/question_groups/{QUESTION_GROUP_ID}
```

### レスポンス

| param               | type   | description                                    |
| ------------------- | ------ | ---------------------------------------------- |
| id                  | number | 質問群 ID                                      |
| title               | string | タイトル                                       |
| descriptions        | string | 説明                                           |
| questions[].id      | number | 質問 ID                                        |
| questions[].text    | string | 質問文                                         |
| questions[].type    | string | 質問タイプ<br>select: 選択式<br>text: 自由記述 |
| questions[].answers | array  | 解答一覧                                       |

```javascript
{
    id: number,
    title: string,
    description: string,
    questions: [
        {
            id: number,
            text: string,
            type: string
            answers: [
                {
                    id: number,
                    text: string,
                },
                ...
            ]
        },
        ...
    ]
}
```

## 質問取得 API

### リクエスト

```
GET /api/question_groups/{QUESTION_GROUP_ID}/questions/{QUESTION_ID}
```

### レスポンス

| param          | type   | description                                    |
| -------------- | ------ | ---------------------------------------------- |
| id             | number | 質問 ID                                        |
| text           | string | 質問文                                         |
| type           | string | 質問タイプ<br>select: 選択式<br>text: 自由記述 |
| answers        | array  | 解答一覧                                       |
| answers[].id   | number | 解答 ID                                        |
| answers[].text | number | 解答                                           |

```javascript
{
    id: number,
    text: string,
    type: string,
    answers: [
        {
            id: number,
            text: string,
        },
        ...
    ]
}
```

## 解答開始 API

### リクエスト

```
PUT /api/question_groups/{QUESTION_GROUP_ID}/start
```

### レスポンス

| param                     | type   | description     |
| ------------------------- | ------ | --------------- |
| user_answer_id            | number | ユーザー解答 ID |
| question_group_id         | number | 質問群 ID       |
| question[].text           | string | 質問文          |
| question[].id             | number | 質問 ID         |
| question[].answers[].id   | number | 解答 ID         |
| question[].answers[].text | string | 解答            |

```javascript
{
    user_answer_id: number,
    question_group_id: number,
    question: {
        text: string,
        id: number,
        answers: [
            {
                id: number,
                text: string,
            },
            ...
        ]
    }
}
```

## 解答 API

### リクエスト

| param          | type   | description     |
| -------------- | ------ | --------------- |
| user_answer_id | number | ユーザー解答 ID |
| question_id    | number | 質問 ID         |
| answer_id      | number | 解答 ID         |

```
POST /api/question_groups/{QUESTION_GROUP_ID}/answer
{
    user_answer_id: number,
    question_id: number,
    answer_id: number,
}
```

### レスポンス

#### 次の解答があるとき

| param                     | type   | description     |
| ------------------------- | ------ | --------------- |
| user_answer_id            | number | ユーザー解答 ID |
| question_group_id         | number | 質問群 ID       |
| question[].text           | string | 質問文          |
| question[].id             | number | 質問 ID         |
| question[].answers[].id   | number | 解答 ID         |
| question[].answers[].text | string | 解答            |

```javascript
{
    user_answer_id: number,
    question_group_id: number,
    question: {
        text: string,
        id: number,
        answers: [
            {
                id: number,
                text: string,
            },
            ...
        ]
    }
}
```

#### 最後の質問に解答したとき

結果画面にリダイレクト

```
303 See Other
Location: {結果画面URL}?result_id=
```
