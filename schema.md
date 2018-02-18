# Data schemas

## Promises
- promise_id `String`
- contributor_id `String`
- politican_id `String`
- source_date `Date`
- source_name `String`
- source_url `String`
- category `String`
- title `String`
- quote `String`
- notes `String`
- status `String`
- live `Boolean`
- created_at `Timestamp`
- updated_at `Timestamp`

## Politician
- politican_id `String`
- contributor_id `String`
- profile_image `String`
- name `String`
- primary_position `String`
- brief `String`
- description `String`
- status `String`
- live `Boolean`
- created_at `Timestamp`
- updated_at `Timestamp`

## Submissions
- submission_id `String`
- contributor_id `String`
- politician_id `String`
- politician_name `String`
- promise_summary `String`
- exact_quote `String`
- source_name `String`
- source_url `String`
- contributor_name `String`
- contributor_email `String`
- contributor_contact `String`
- contributor_notes `String`
- status `String`
- created_at `Timestamp`
- updated_at `Timestamp`
