import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import BookServiceLink from '../components/BookServiceLink';
import { getServiceImageUrl, images } from '../lib/images';
import { PageContent, PageHero } from '../components/PageLayout';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [data, setData] = useState<{
    subService: {
      name: string;
      description: string;
      imageUrl: string;
      durationMinutes: number;
      youtubeUrl: string;
      steps: { title: string; description: string; order: number }[];
    };
    category: { name: string; slug: string };
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    api<{
      subService: {
        name: string;
        description: string;
        imageUrl: string;
        durationMinutes: number;
        youtubeUrl: string;
        steps: { title: string; description: string; order: number }[];
      };
      category: { name: string; slug: string };
    }>(`/sub-services/${slug}`).then(setData);
  }, [slug]);

  if (!data || !slug) {
    return (
      <PageContent>
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 rounded-full border-4 border-plutonic-blue/20 border-t-plutonic-blue animate-spin" />
        </div>
      </PageContent>
    );
  }

  const { subService, category } = data;
  const videoId = subService.youtubeUrl?.match(/(?:youtu\.be\/|v=)([^&]+)/)?.[1];

  return (
    <div className="pb-safe md:pb-0">
      <PageHero
        size="compact"
        eyebrow={category.name}
        title={subService.name}
        image={getServiceImageUrl(slug, subService.imageUrl) || images.cleaning}
      />

      <PageContent narrow>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to={`/services?category=${category.slug}`}
            className="inline-flex items-center gap-1 text-sm text-plutonic-blue font-semibold hover:underline"
          >
            ← Back to {category.name}
          </Link>
          <BookServiceLink slug={slug} label="Book now →" className="!py-2 !px-4 !text-sm" />
        </div>

        <div className="premium-card-glow p-6 md:p-8 mb-6">
          <p className="text-gray-700 leading-relaxed">{subService.description}</p>
        </div>

        {videoId && (
          <div className="premium-card-glow p-6 md:p-8 mb-6">
            <h2 className="font-bold text-xl text-plutonic-blue-dark mb-4">Watch how it works</h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-inner">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={subService.name}
                allowFullScreen
              />
            </div>
          </div>
        )}

        {subService.steps?.length > 0 && (
          <div className="premium-card-glow p-6 md:p-8 mb-8">
            <h2 className="font-bold text-xl text-plutonic-blue-dark mb-6">Service steps</h2>
            <ol className="space-y-5">
              {subService.steps
                .sort((a, b) => a.order - b.order)
                .map((step, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="step-ring !w-10 !h-10 !text-sm shrink-0">{i + 1}</span>
                    <div>
                      <h3 className="font-bold text-plutonic-blue-dark">{step.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <BookServiceLink slug={slug} label="Book now →" />
          <Link to={`/services?category=${category.slug}`} className="btn-outline">
            More {category.name.toLowerCase()} services
          </Link>
        </div>
      </PageContent>

      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-sky-200 bg-white/95 backdrop-blur-md p-4 shadow-[0_-8px_30px_rgba(14,165,233,0.12)] md:hidden">
        <BookServiceLink slug={slug} fullWidth label="Book now →" />
      </div>
    </div>
  );
}
