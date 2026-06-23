import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCountUp } from './useCountUp';

function Demo() {
  const { ref, value } = useCountUp<HTMLParagraphElement>(500);
  return <p ref={ref}>{value}</p>;
}

describe('useCountUp', () => {
  it('starts at 0 before the element enters the viewport', () => {
    render(<Demo />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
