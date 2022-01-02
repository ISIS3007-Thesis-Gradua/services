exports.stepNames = {
  step00: 'step00',
  step01: 'step01',
  step1: 'step1',
  step2: 'step2',
  step3: 'step3',
  step4: 'step4',
  step5: 'step5',
  step6: 'step6',
  step7: 'step7'
}
exports.getTimeFromSSML = (text) => {
  // This is just for getting the numbers in te String. Shouldn't be more than 1 chain of numbers
  const numbers = /d+/g
  // This regex supports spaces between the number and the seconds key "s".
  const seconds = /d+s*s/g

  const miliseconds = /d+s*ms/g
  let matched
  try {
    matched = numbers.exec(text)
  } catch (error) {
    console.error(error)
  }
  const parsedNumbers = parseInt(matched ?? '100')
  if (miliseconds.test(text)) {
    return parsedNumbers / 1000
  } else if (seconds.test(text)) {
    return parsedNumbers
  } else {
    return parsedNumbers / 1000
  }
}
