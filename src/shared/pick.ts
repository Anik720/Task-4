const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {}
  console.log(6, keys)
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      console.log(9, obj, key)
      finalObj[key] = obj[key]
    }
  }

  return finalObj
}

export default pick
