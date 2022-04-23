# データベース設計

## question_groups
pk id
title
description
first_question_id

## questions
pk id
pk f question_group_id
text
type

## answers
pk id
f question_id
text

## user_answers
pk id
f question_group_id

## user_question_answers
pk f  user_answer_id
pk f question_id
f answer_id
text nullable

## answer_results
pk f answer_id
f next_question_id nullable
f question_group_result_id nullable

## question_group_results
pk id
f question_group_id
text
redirect_url
