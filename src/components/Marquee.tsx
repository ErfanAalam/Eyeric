"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface MarqueeContent {
  id: number;
  content: string;
  is_active: boolean;
  display_order: number;
}

interface MarqueeProps {
  speed?: number;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ speed = 30, className = "" }) => {
  const [content, setContent] = useState<MarqueeContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchMarqueeContent = async () => {
      try {
        const { data, error } = await supabase
          .from('marquee_content')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Filter active content and sort by display order
        const activeContent = data
          .filter((item: MarqueeContent) => item.is_active)
          .sort((a: MarqueeContent, b: MarqueeContent) => a.display_order - b.display_order);
        setContent(activeContent);
      } catch (error) {
        console.error('Error fetching marquee content:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarqueeContent();
  }, []);

  if (isLoading) {
    return null;
  }

  if (hasError || content.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 text-white py-2 overflow-hidden ${className}`}>
      <div 
        className="whitespace-nowrap animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {content.map((item) => (
          <span key={item.id} className="inline-block mx-8 text-sm font-medium">
            {item.content}
          </span>
        ))}
        {/* Duplicate content for seamless loop */}
        {content.map((item) => (
          <span key={`duplicate-${item.id}`} className="inline-block mx-8 text-sm font-medium">
            {item.content}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee; 