<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Copy Webpack Plugin</h1>
  <p>Copies individual files or entire directories to the build directory.</p>
</div>

<h2 align="center">Install</h2>

```
npm install --save-dev copy-webpack-plugin
```

<h2 align="center">Usage</h2>

`new CopyWebpackPlugin([patterns], options)`

A pattern looks like:
`{ from: 'source', to: 'dest' }`

Or, in the simple case of just a `from` with the default destination, you can use a string primitive instead of an object:
`'source'`

#### Pattern properties:

| Name | Required | Default     | Details                                                 |
|------|----------|------------ |---------------------------------------------------------|
| `from` | Y |  | _examples:_<br>'relative/file.txt'<br>'/absolute/file.txt'<br>'relative/dir'<br>'/absolute/dir'<br>'\*\*/\*'<br>{glob:'\*\*/\*', dot: true}<br><br>Globs accept [minimatch options](https://github.com/isaacs/minimatch) |
| `to`   | N | output root if `from` is file or dir<br><br>resolved glob path if `from` is glob | _examples:_<br>'relative/file.txt'<br>'/absolute/file.txt'<br>'relative/dir'<br>'/absolute/dir'<br>'relative/[name].[ext]'<br>'/absolute/[name].[ext]'<br><br>Templates are [file-loader patterns](https://github.com/webpack/file-loader) |
| `toType` | N | **'file'** if `to` has extension or `from` is file<br><br>**'dir'** if `from` is directory, `to` has no extension or ends in '/'<br><br>**'template'** if `to` contains [a template pattern](https://github.com/webpack/file-loader) | |
| `context` | N | options.context \|\| compiler.options.context | A path that determines how to interpret the `from` path |
| `flatten` | N | false | Removes all directory references and only copies file names<br><br>If files have the same name, the result is non-deterministic |
| `ignore` | N | [] | Additional globs to ignore for this pattern |
| `transform` | N | function(content, path) {<br>&nbsp;&nbsp;return content;<br>} | Function that modifies file contents before writing to webpack |
| `force` | N | false | Overwrites files already in compilation.assets (usually added by other plugins) |
| `cache` | N | false | Enable `transform` caching. You can use `{ cache: { key: 'my-cache-key'} }` to invalidate cache. |

#### Available options:

| Name | Default | Details |
| ---- | ------- | ------- |
| `context` | compiler.options.context | A path that determines how to interpret the `from` path, shared for all patterns |
| `ignore` | [] | Array of globs to ignore (applied to `from`) |
| `copyUnmodified` | false | Copies files, regardless of modification when using watch or webpack-dev-server. All files are copied on first build, regardless of this option. |
| `debug` | **'warning'** | _options:_<br>**'warning'** - only warnings<br>**'info'** or true - file location and read info<br>**'debug'** - very detailed debugging info

### Examples

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    context: path.join(__dirname, 'app'),
    devServer: {
        // This is required for older versions of webpack-dev-server
        // if you use absolute 'to' paths. The path should be an
        // absolute path to your build destination.
        outputPath: path.join(__dirname, 'build')
    },
    plugins: [
        new CopyWebpackPlugin([
            // {output}/file.txt
            { from: 'from/file.txt' },
            
            // equivalent
            'from/file.txt',

            // {output}/to/file.txt
            { from: 'from/file.txt', to: 'to/file.txt' },
            
            // {output}/to/directory/file.txt
            { from: 'from/file.txt', to: 'to/directory' },

            // Copy directory contents to {output}/
            { from: 'from/directory' },
            
            // Copy directory contents to {output}/to/directory/
            { from: 'from/directory', to: 'to/directory' },
            
            // Copy glob results to /absolute/path/
            { from: 'from/directory/**/*', to: '/absolute/path' },

            // Copy glob results (with dot files) to /absolute/path/
            {
                from: {
                    glob:'from/directory/**/*',
                    dot: true
                },
                to: '/absolute/path'
            },

            // Copy glob results, relative to context
            {
                context: 'from/directory',
                from: '**/*',
                to: '/absolute/path'
            },
            
            // {output}/file/without/extension
            {
                from: 'path/to/file.txt',
                to: 'file/without/extension',
                toType: 'file'
            },
            
            // {output}/directory/with/extension.ext/file.txt
            {
                from: 'path/to/file.txt',
                to: 'directory/with/extension.ext',
                toType: 'dir'
            },
            
            // Ignore some files using glob in nested directory
            {
                from: 'from/directory',
                to: 'to/directory',
                ignore: ['nested/**/*.extension']
            }
        ], {
            ignore: [
                // Doesn't copy any files with a txt extension    
                '*.txt',
                
                // Doesn't copy any file, even if they start with a dot
                '**/*',

                // Doesn't copy any file, except if they start with a dot
                { glob: '**/*', dot: false }
            ],

            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
        })
    ]
};
```
