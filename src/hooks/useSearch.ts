import React from 'react';
import { Sifter } from '../libs/sifter';

export const useSearch = (items: SearchItem[], opts: SearchOpts) => {
  const sifter = React.useRef<Sifter | null>(new Sifter(items));
  const isSearchIndexReady = React.useRef(false);

  const handleSearch = (text: string) => {
    const res = sifter.current?.search(text, {
      limit: opts.limit || 5,
      fields: [{ field: 'label', weight: 1 }],
      sort: [{ field: 'label', direction: opts.sort || 'desc' }],
      conjunction: '',
    });

    let _items = res?.items
      .map((item) => items[item.id as number])
      .filter((item) => item !== undefined) as typeof items;

    if (res?.query.length === 0) {
      _items = [...items];
    } else {
      res?.tokens.forEach((token) => {
        const regExp = token.regex;

        if (regExp) {
          _items = _items.map((item) => {
            const label = item.label;
            const match = label.match(regExp);

            if (match) {
              const start = match.index;

              if (start === undefined) {
                return item;
              }

              const end = start + match[0].length;

              const startStr = label.slice(0, start);
              const endStr = label.slice(end);
              const matchStr = label.slice(start, end);
              const newLabel = `${startStr}${opts.wrapMatch.start}${matchStr}${opts.wrapMatch.end}${endStr}`;

              return { ...item, label: newLabel };
            }

            return item;
          });
        }
      });
    }

    return _items;
  };

  const warmUpSearch = () => {
    if (isSearchIndexReady.current) return;

    const startTime = performance.now();
    handleSearch('a');
    const endTime = performance.now();

    isSearchIndexReady.current = true;

    console.log('Warm Up Search Index time MS:', endTime - startTime);
  };

  return { handleSearch, warmUpSearch };
};

export interface SearchItem {
  id: string | number;
  label: string;
}

export interface SearchOpts {
  wrapMatch: {
    start: string;
    end: string;
  };
  limit?: number;
  sort?: 'asc' | 'desc';
}
