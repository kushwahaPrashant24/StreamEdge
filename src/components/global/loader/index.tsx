import React from 'react';
import {Spinner} from './spinner'; // Ensure this import is correct
import { cn } from '@/lib/utils'; // Ensure this import is correct

type Props = {
  state: boolean;
  className?: string;
  color?: string;
  children?: React.ReactNode;
};

const Loader = ({ state, className, color, children }: Props) => {
  return state ? (
    <div className={cn(className)}>
      <Spinner color={color} /> {/* Pass the color prop to Spinner if it supports it */}
    </div>
  ) : (
    children
  );
};

export default Loader;