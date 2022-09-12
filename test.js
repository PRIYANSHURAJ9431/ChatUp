// // function numSundaysOnFirst(year) {
// //   let sundays = 0;

// //   for (let day = 0; day < 12; day++) {
// //     if (new Date(year, day, 1).getDay() === 0) {
// //       //   console.log(new Date(year, 0, day));
// //       sundays++;
// //     }
// //   }
// //   return sundays;
// // }

// // console.log(numSundaysOnFirst(1999));

// // ---------------------------------------------------------

// function countCircularPrimes(n) {
//   let ans = 1;
//   var nNew = (n - 2) / 2;

//   marked = Array.from({ length: nNew + 1 }, (_, i) => false);

//   SOS(marked, nNew);

//   //   console.log("2 ");

//   for (i = 1; i <= nNew; i++) {
//     if (marked[i] == true) continue;

//     var num = 2 * i + 1;
//     num = Rotate(num);
//     while (num != 2 * i + 1) {
//       if (num % 2 == 0) break;
//       if (marked[parseInt((num - 1) / 2)] == false) num = Rotate(num);
//       else break;
//     }

//     if (num == 2 * i + 1) {
//       //   console.log(num + " ");
//       ans++;
//     }
//   }

//   //   console.log(ans);
//   return ans;
// }

// function SOS(marked, nNew) {
//   for (i = 1; i <= nNew; i++)
//     for (j = i; i + j + 2 * i * j <= nNew; j++)
//       marked[i + j + 2 * i * j] = true;
// }

// function countDigits(n) {
//   var digit = 0;
//   while ((n = parseInt(n / 10)) > 0) digit++;
//   return digit;
// }

// function Rotate(n) {
//   var rem = n % 10;

//   rem *= Math.pow(10, countDigits(n));

//   n = parseInt(n / 10);
//   n += rem;
//   return n;
// }

// // Driver code
// var n = 100;
// console.log(countCircularPrimes(n));

function isPrime(n) {
  if (n == 1) return false;
  for (var i = 2; i <= Math.sqrt(n); i++) {
    if (n % i == 0) return false;
  }
  return true;
}

function rotate(n) {
  var nn = "" + n;
  var n2 = nn[nn.length - 1] + nn.substring(0, nn.length - 1);
  return parseInt(n2);
}

function circular(N) {
  var outbound = 0;
  for (var i = 2; i <= N; i++) {
    var isMatch = true;
    var check = i;
    for (j = 0; j < ("" + i).length; ++j) {
      if (!isPrime(check)) {
        isMatch = false;
        break;
      }
      check = rotate(check);
    }
    if (isMatch) outbound++;
  }
  return outbound;
}

console.log(circular(1));
console.log(circular(100));
