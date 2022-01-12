export default function topsis_predict(dataset, criteria) {
  const weights = criteria.map((c) => c.weight)
  const _sum = (v) => v.reduce((a, acc) => acc + a)
  const _column_sum = (i) => _sum(dataset.map((row) => Math.pow(row[i], 2)))

  //标准化
  const rating_vector = dataset.map((row) =>
    row.map((d, i) => d / Math.sqrt(_column_sum(i)))
  )

  //加权矩阵
  const product_vector = rating_vector.map((row) =>
    row.map((value, i) => weights[i] * value)
  )

  //最优、最劣方案
  const positive_ideal = []
  const negative_ideal = []
  for (const criterion of criteria) {
    const values = product_vector.map((row) => row[criteria.indexOf(criterion)])
    const min = Math.min(...values),
      max = Math.max(...values)
    positive_ideal.push(criterion.type === 'cost' ? min : max)
    negative_ideal.push(criterion.type === 'cost' ? max : min)
  }

  //最优距离
  const positive_distances = product_vector.map((row) =>
    Math.sqrt(
      _sum(row.map((valor, j) => Math.pow(positive_ideal[j] - valor, 2)))
    )
  )

  //最劣距离
  const negative_distances = product_vector.map((row) =>
    Math.sqrt(
      _sum(row.map((valor, j) => Math.pow(negative_ideal[j] - valor, 2)))
    )
  )

  //相对接近度
  const e_vector = negative_distances.map(
    (d_, i) => d_ / (positive_distances[i] + d_)
  )
  let result = [...e_vector]
    .sort()
    .reverse()
    .map((d) => [e_vector.indexOf(d)])
  result.forEach((item) => item.push((e_vector[item] * 100).toFixed(2)))
  return result
}
