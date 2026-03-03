# Concurrency & Licenses exercise

As the instructions mentioned a single deliverable per question, but there was some ambiguety _(for example on the first question it mentions "implement a function that", but then also "How would you write a test for such a function?")_, I preferred to err on the side of caution and implement both solutions (both the working function(s) and the corresponding test(s)) following a standard file structure with the number of files I considered best, and test split into their own files.

You can file the main functions here:
```
/src/concurrency/concurrency.ts
/src/licenses/get-license-plate-by-index.ts
/src/licenses/to-letter-base.ts
```

and the tests here:
```
/test/concurrency/concurrency.test.ts
/test/licenses/licenses.test.ts
/test/licenses/to-letter-base.test.ts
```

### Assumptions

* There was no specific mention of languages, only the title of the first question inclusing "JS" as a hint, but for consistency with the previous Angular exercise I implemented the solutions in TypeScript; if need be this can be adjusted.
* There was no test requirement for the Licenses exercise, and only a mention of how it would be tested for the first; again for consistency with the previous exercise, both tests are implemented using Vitest.
