const json = require("../locales/zh-CN/translation.json")

const findDuplicates = (obj) => {
  const values = {}
  const duplicates = {}

  const traverse = (obj, path = "") => {
    for (const key in obj) {
      const value = obj[key]
      const currentPath = path ? `${path}.${key}` : key

      if (typeof value === "object" && !Array.isArray(value)) {
        traverse(value, currentPath)
      } else {
        if (values[value]) {
          if (!duplicates[value]) {
            duplicates[value] = [values[value]]
          }
          duplicates[value].push(currentPath)
        } else {
          values[value] = currentPath
        }
      }
    }
  }

  traverse(obj)
  return duplicates
}

const duplicates = findDuplicates(json)
