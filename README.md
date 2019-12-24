# vue-gantt-planner

This is a Gantt tool for project management. I needed such tool at work and decided to make a open source repo. 

> Under development, dec 2019 - jan 2020  
> Welcome to contribute or ask questions
>
## Project setup
```
npm install
```

### Compiles and hot-reloads for development (demo here)
```
npm run serve
```

### Roadmap

As I wrote above this is under development. The steps I know I want to add are:

 - staff based view (currently default and only) (mvp ✔️)
 - add proper types to props
 - project based view
 - drag and drop between dates of same staff row (mvp ✔️)
 - drag and drop between staff (and date) (mvp ✔️)
 - emit changes to parent component ✔️
 - re-arrange projects so they fits in minimal number of rows
 - automatically assignment of staff into projects
 - i18n or a prop that can set terms in different languages
 - project milestones 
 - baselines (to save/import state) for future analysis 
 - add integration for project tools like Jira or Trello
 - project metadata like:
     - assignment percentage (staff engagement % in project)
     - staff role

### Compiles and minifies for production
```
npm run build
```

### Run your end-to-end tests (todo)
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
