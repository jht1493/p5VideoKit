// report array of bits as BigInt in div

export function report_1ofn(my) {
  if (!my.do_report) return;
  let bnum = 2n ** BigInt(my.now.length);
  let bstr = ' 0x' + bnum.toString(16).toUpperCase();
  let str = '1 of ' + bnum.toLocaleString('en-US') + bstr + '<br/> ';
  let div = createP('<code style="font-size:16px">' + str + '</code>');
  // div.style('margin-left:2px');
}

export function div_report(my, arr, msg) {
  // console.log('div_report', msg);
  if (!my.do_report) return;
  if (!my.div) {
    my.div = createP();
  }
  let narr = arr.concat();
  narr.reverse();
  let str = narr.join('');
  let bnum = BigInt('0b' + str);
  // str = bnum.toLocaleString('en-US') + ' ' + msg + '<br/> ';
  let bstr;
  if (bnum >= 256n) {
    bstr = ' 0x' + bnum.toString(16).toUpperCase();
  } else {
    bstr = ' 0b' + bnum.toString(2);
  }
  // &nbsp;
  str = '' + bnum.toLocaleString('en-US') + bstr + '<br/> ';
  my.report_lines.unshift(str);
  while (my.report_lines.length > my.do_report) {
    my.report_lines.pop();
  }
  my.div.elt.innerHTML = '<code style="font-size:16px">' + my.report_lines.join('') + '</code>';
}
