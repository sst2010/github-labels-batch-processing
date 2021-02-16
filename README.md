# [github-labels-batch-processing](#)

Simple, cool scripts to batch process labels for your GitHub organisations and repositories

> - Creator: Samagra Singh Tomar a.k.a. SST, [Mail](mailto:samagrasinghtomar2010@gmail.com)

## Warning !!

- The scripts can potentially delete or update your GitHub labels. Use them with care and ideally after testing on sample repositories.
- I do not assume any repsonsibility for damage done, if any due to the use of the scripts.

## What is this ??

We all know that the default labels GitHub provides with each repository are not enough to sufficiently or accurately handle all software development states. To resolve this, even if you had a set of labels to use, it's a painful task to manually add or update those labels for each repository. Sure, if it's a new organization, you can create a default set of labels to be used in new repos but even there it would be tedious to add several labels manually.

To save you this pain, you can use the above scripts to get all your labels of a repo or organization or to create/delete/update them.

## How to use the scripts ??

- Open the list of labels in any repository or the default labels page in organization settings.
- Open the dev-panel with Ctrl/Cmd + Shift + I.
- Choose the script you want to use, study it's comments, modify them as needed and then proceed to the next step.
  - `fetch-labels.js` can be run without any considerations as it doesn't alter anything.
  - `update-labels.js` will need to be carefully studied and provided with input configurations.
- In the console, paste your updated script and hit `Enter`. The output in console will show the status of the task.

## Quick tips to create and use JSONs

You're right !! I didn't create those scripts just for fun. First, I created my own set of labels that I wanted to use and then created those scripts to ease my pain. There's another document ( `labels-i-use.md` ) which contains more information about the labels I use and their JSON structure.

Feel free to use them or take inspiration from them. Also, I'd love to hear your inputs on them as well.

## Pending tasks

I have some tasks planned for this project. I will get to them as soon as you can. If you'd like to help contribute by doing some of the tasks, feel free to submit a PR or contact me on my mail.

- Add label detection feature to warn the users beforehand if the script will work or not.
- Add dry run feature.
- Add feature to handle multi-page labels ( large amount of labels ) in an automated manner.
  - Currently, script needs to be run on all label pages manually.
- Add feature to do it for multiple repositories in an automated manner.
  - Currently, script needs to be run on all repo pages manually.
- Create a user-friendly browser extension or at least UI interface ( with injected HTML ).

## Farewell

Feel free to reach out to me in case of any queries or suggestions. ( Email provided at the top. )
