import _ from 'lodash';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';


const inc = (A, B, sortKey) => {
  const a = A[sortKey] ? A[sortKey].toLowerCase() : A[sortKey];
  const b = B[sortKey] ? B[sortKey].toLowerCase() : B[sortKey];
  return !a - !b || +(a > b) || -(a < b);
};

const dec = (A, B, sortKey) => {
  const a = A[sortKey] ? A[sortKey].toLowerCase() : A[sortKey];
  const b = B[sortKey] ? B[sortKey].toLowerCase() : B[sortKey];
  return !a - !b || -(a > b) || +(a < b);
};

const incDate = (A, B, sortKey) => {
  const a = new Date(A[sortKey]);
  const b = new Date(B[sortKey]);
  return !a - !b || +(a > b) || -(a < b);
};

const decDate = (A, B, sortKey) => {
  const a = new Date(A[sortKey]);
  const b = new Date(B[sortKey]);
  return !a - !b || -(a > b) || +(a < b);
};

const incNum = (A, B, sortKey) => {
  const a = A[sortKey] ? parseInt(A[sortKey]) : A[sortKey];
  const b = B[sortKey] ? parseInt(B[sortKey]) : B[sortKey];
  return !a - !b || +(a > b) || -(a < b);
};

const decNum = (A, B, sortKey) => {
  const a = A[sortKey] ? parseInt(A[sortKey]) : A[sortKey];
  const b = B[sortKey] ? parseInt(B[sortKey]) : B[sortKey];
  return !a - !b || -(a > b) || +(a < b);
};

const incNested = (A, B, key) => {
  const a = A[key[0]] ? (A[key[0]][key[1]] ? A[key[0]][key[1]].toLowerCase() : A[key[0]][key[1]]) : A[key[0]];
  const b = B[key[0]] ? (B[key[0]][key[1]] ? B[key[0]][key[1]].toLowerCase() : B[key[0]][key[1]]) : B[key[0]];

  return !a - !b || +(a > b) || -(a < b);
};

const decNested = (A, B, key) => {
  const a = A[key[0]] ? (A[key[0]][key[1]] ? A[key[0]][key[1]].toLowerCase() : A[key[0]][key[1]]) : A[key[0]];
  const b = B[key[0]] ? (B[key[0]][key[1]] ? B[key[0]][key[1]].toLowerCase() : B[key[0]][key[1]]) : B[key[0]];

  return !a - !b || -(a > b) || +(a < b);
};

export default function onSort(key, data, sortKey, type) {
  const keys = sortKey.split('.');
  try {
    if (keys.length > 1) {
      this.state.sortType === 'asc'
        ? data.sort((a, b) => decNested(a, b, keys))
        : data.sort((a, b) => incNested(a, b, keys));
    } else if (sortKey === 'createdOn' || sortKey === 'modifiedOn' || sortKey === 'publishedOn') {
      this.state.sortType === 'asc'
        ? data.sort((a, b) => decDate(a, b, sortKey))
        : data.sort((a, b) => incDate(a, b, sortKey));
    } else if (type === 'number') {
      this.state.sortType === 'asc'
        ? data.sort((a, b) => decNum(a, b, sortKey))
        : data.sort((a, b) => incNum(a, b, sortKey));
    } else {
      this.state.sortType === 'asc' ? data.sort((a, b) => dec(a, b, sortKey)) : data.sort((a, b) => inc(a, b, sortKey));
    }

    this.setState((prev) => ({
      activeCol: sortKey,
      [key]: data,
      sortType: prev.sortType === 'desc' ? 'asc' : 'desc',
    }));
  } catch (err) {
    // console.log(err);
  }
}

export function descendingComparator(a, b, orderBy) {
  const keys = orderBy.split('.');
  let A = '';
  let B = '';
  if (keys.length > 1) {
    for (let i = 0; i < keys.length; i++) {
      if (a[keys[i]] && i !== keys.length - 1) {
        a = Array.isArray(a[keys[i]]) ? a[keys[i]][0] : a[keys[i]];
      } else if (a[keys[i]]) {
        A = isNaN(a[keys[i]])
          ? typeof a[keys[i]] === 'string'
            ? a[keys[i]].toLowerCase()
            : a[keys[i]]
          : parseInt(a[keys[i]]);
      }
      if (b[keys[i]] && i !== keys.length - 1) {
        b = Array.isArray(b[keys[i]]) ? b[keys[i]][0] : b[keys[i]];
      } else if (b[keys[i]]) {
        B = isNaN(b[keys[i]])
          ? typeof b[keys[i]] === 'string'
            ? b[keys[i]].toLowerCase()
            : b[keys[i]]
          : parseInt(b[keys[i]]);
      }
    }
  } else {
    if (a[orderBy]) {
      A = isNaN(a[orderBy])
        ? typeof a[orderBy] === 'string'
          ? a[orderBy].toLowerCase()
          : a[orderBy]
        : parseInt(a[orderBy]);
    }
    if (b[orderBy]) {
      B = isNaN(b[orderBy])
        ? typeof b[orderBy] === 'string'
          ? b[orderBy].toLowerCase()
          : b[orderBy]
        : parseInt(b[orderBy]);
    }
  }
  if (B < A) {
    return -1;
  } else if (B > A) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const ord = comparator(a[0], b[0]);
    if (ord !== 0) return ord;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const handleErrorMessage = (err) => {
  if (
    err.response &&
    err.response.data &&
    (err.response.data.success === false || err.response.data.status === false) &&
    err.response.data.message
  ) {
    toast.error(err.response.data.message);
  } else {
    toast.error(err.message);
  }
};

export const dateValidation = (currentDate, minDate, maxDate) => {
  return currentDate.isBefore(maxDate) && currentDate.isAfter(minDate);
};

export const getFullName = (firstName = '', lastName = '') => {
  return `${firstName} ${lastName}`.trim() ? `${firstName} ${lastName}` : 'Anonymous';
};

export const toTitleCase = (str) => {
  if (!str) {
    return '';
  }
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const isArrayEqual = (a, b) => {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val) => b.includes(val));
};

