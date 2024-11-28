import React from 'react';

export const TagList: TagListComponent = (props) => {
  return props.tags.map((tag, index) => props.render(tag, index));
};

export const TagListMemoized = React.memo(TagList);

interface TagListProps {
  tags: string[];
  render: (tag: string, index: number) => React.ReactNode;
}

type TagListComponent = React.FC<TagListProps>;
