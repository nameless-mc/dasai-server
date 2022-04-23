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

| param             | type   | description |
| ----------------- | ------ | ----------- |
| id                | number | 質問群 ID   |
| questions[].id    | number | 質問 ID     |
| questions[].title | string | タイトル    |

```javascript
{
    id: number,
    title: string,
    description: string,
    type: number,
    questions: [
        {
            id: number,
            text: string,
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

```javascript
{
    id: number,
    text: string,
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

```javascript
{
    user_answer_id: number,
    question_id: number,
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

```
303 See Other
Location: {結果画面URL}?result_id=
```
