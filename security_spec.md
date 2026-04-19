# Security Specification for GradeOS

## 1. Data Invariants
- A `Subject` must belong to a user.
- A `Topic` must belong to a `Subject` which belongs to the same user.
- `QuizResults` and `ReviewItems` are personally identifiable and must not be shared.
- `userId` fields in any document must strictly match the authenticated user's UID.

## 2. Integrity Challenges ("Dirty Dozen" Payloads)
1. **Identity Spoofing**: Attempting to create a `Subject` under `/users/other-user-id/`.
2. **Key Injection**: Adding an `isAdmin` field to the `User` document.
3. **Invalid ID**: Using a 5KB string as a `subjectId`.
4. **Orphaned Topic**: Creating a `Topic` under a `subjectId` that doesn't exist.
5. **State Skipping**: Manually setting `progress` to 100 on a subject without topics.
6. **Timeline Poisoning**: Setting `createdAt` to a future date instead of `request.time`.
7. **Type Mismatch**: Sending a string for `progress`.
8. **Size Violation**: A topic title exceeding 500 characters.
9. **Relational Sync Break**: Updating a deadline without a valid `subjectId`.
10. **Shadow Key**: Adding undocumented fields like `metadata_secret`.
11. **Immutation Break**: Trying to change the `userId` in `User` profile.
12. **Batch Desync**: Deleting a subject while leaving its topics orphaned (Logic layer check).

## 3. Deployment Plan
- Default Deny.
- User-scoped matching.
- Attribute-based validation helpers.
