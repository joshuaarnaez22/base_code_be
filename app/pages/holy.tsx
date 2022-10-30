import React from 'react';
import Website from '@/components/website';
import { IWebsiteResource } from '@/services/types';

export const getStaticProps = async () => {
  const resources: IWebsiteResource[] = [
    {
      img: 'mapcursor.png',
      title: 'City center office',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut ',
    },
    {
      img: 'clock.png',
      title: 'City center office',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut ',
    },
    {
      img: 'phone.png',
      title: 'City center office',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut ',
    },
    {
      img: 'mapcursor.png',
      title: 'City center office',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut ',
    },
    {
      img: 'leaves.png',
      title: 'City center office',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut ',
    },
    {
      img: 'swap.png',
      title: 'City center office',
      description:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut ',
    },
  ];
  return {
    props: {
      resources,
    },
  };
};

const holy = ({ resources }: any) => {
  return <Website resources={resources} />;
};

export default holy;
