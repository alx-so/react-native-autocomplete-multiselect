import React from 'react';
import type { TagItem } from '../../types/common';

export const TagList: TagListComponent = (props) => {
  return props.tags.map((tag, index) => props.render(tag, index));
};

export const TagListMemoized = React.memo(TagList);

interface TagListProps {
  tags: TagItem[];
  render: (tag: TagItem, index: number) => React.ReactNode;
}

type TagListComponent = React.FC<TagListProps>;
