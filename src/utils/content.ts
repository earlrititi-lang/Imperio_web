// Keep collection pages consistent by sorting dated entries newest-first in one place.
type EntryWithDate = {
  data: {
    date: string;
  };
};

export const sortEntriesByDateDesc = <T extends EntryWithDate>(entries: T[]) =>
  [...entries].sort(
    (left, right) =>
      new Date(right.data.date).getTime() - new Date(left.data.date).getTime()
  );
