var chalk = require('chalk');

/**
 * Error responses
 */

'use strict';

module.exports = function(res, status, error) {
  // console.log('\033[31mError! \033[91m', error, status)
  console.log(chalk.red('Error!', error, status))
  res.status(status || 500).send(error || 'internal server error');
}
//
// module.exports[404] = function pageNotFound(req, res) {
//   var viewFilePath = '404';
//   var statusCode = 404;
//   var result = {
//     status: statusCode
//   };
//
//   res.status(result.status);
//   res.render(viewFilePath, function (err) {
//     if (err) { return res.json(result, result.status); }
//
//     res.render(viewFilePath);
//   });
// };
