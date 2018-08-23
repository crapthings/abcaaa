const testdata = [
  { idx: 1, beforeOrder: 1, afterOrder: 1 },
  { idx: 2, beforeOrder: 2, afterOrder: 2 },
  { idx: 3, beforeOrder: 3, afterOrder: 3 },
  { idx: 4, beforeOrder: 4, afterOrder: 4 },
  { idx: 5, beforeOrder: 5, afterOrder: 5 },
]

const order = _.orderBy(testdata, ['afterOrder', 'beforeOrder'], ['asc', 'asc'])

console.log(_.random(100000, 200000, true))
