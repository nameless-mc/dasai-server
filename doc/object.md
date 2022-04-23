# Object Mapping Data

## 質問群オブジェクト

```
{
    id: number,
    title: string,
    description: string,
    type: number,
    questions: [
        {
            id: number,
        },
        ...
    ]
}
```

## 質問オブジェクト

```
question: {
    id: number,
    text: string,
    answers: [
        {
            id: number,
            text: string,
        },
    ]
}
```
