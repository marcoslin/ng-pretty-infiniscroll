# ng-pretty-infiniscroll
A infinity scroll with customizable scrollbar for AngularJS

## Setup
```
cd ng-pretty-infiniscroll/
npm install
grunt setup
grunt devel
```

## Notes

### Grunt
It was tricky to spawn a webserver and watch the change.  The final solution involved the combination of following packages:

```
"grunt-express": "~1.2.0",
"grunt-open": "~0.2.3",
"grunt-contrib-watch": "~0.5.3",
```

The main problem relates to `livereload.js` not being server from server spawn by `grunt`.  The secret is to call a `watch` task, even without explicitly configuring a `watch` task, which will server `livereload.js`.

The option `open` in `grunt-express` also refuse to work.  Looking at example provided [grunt-express-angular-example](https://github.com/blai/grunt-express-angular-example), it uses `grunt-open` to launch website so that is what is done here as well.
