// operations on an array of bits

export function array_zero(arr, n) {
  // Fill array a_arr with random true/false values
  for (let index = 0; index < n; index++) {
    arr[index] = 0;
  }
}

export function array_add(arr, d) {
  if (d == 1) {
    array_incr(arr);
  } else if (d == -1) {
    array_decr(arr);
  } else {
    console.log('array_add bad d', d);
  }
}

export function array_decr(arr) {
  let carry = 0;
  for (let index = 0; index < arr.length; index++) {
    let sum = arr[index] + 1 + carry;
    // sum = 1, 2, 3
    arr[index] = sum & 1;
    carry = sum >> 1;
    // carry = 0 or 1
  }
}

export function array_incr(arr) {
  for (let index = 0; index < arr.length; index++) {
    let sum = arr[index] + 1;
    // sum is 1 or 2
    if (sum == 1) {
      arr[index] = 1;
      break;
    }
    // zero and continue to carry the 2
    arr[index] = 0;
  }
}

export function array_random(arr) {
  for (let index = 0; index < arr.length; index++) {
    let bit = random([0, 1]);
    arr[index] = bit;
  }
}

export function array_copy_to_from(to, from) {
  for (let index = 0; index < to.length; index++) {
    to[index] = from[index];
  }
}
