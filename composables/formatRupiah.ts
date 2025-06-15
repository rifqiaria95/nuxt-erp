export const useFormatRupiah = () => {
  return (number: number | string): string => {
    if (number === null || number === '' || number === undefined) return ''

    let number_string = number.toString().replace(/\./g, ',').replace(/[^,\d]/g, ''),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substring(0, sisa),
        ribuan = split[0].substring(sisa).match(/\d{3}/gi)

    if (ribuan) {
      let separator = sisa ? '.' : ''
      rupiah += separator + ribuan.join('.')
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah
    rupiah = rupiah.replace(',00', '');

    return 'Rp ' + rupiah
  }
}