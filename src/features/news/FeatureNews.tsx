import { MOCK_NEWS } from './mockdata.news';
import NewsCard from './components/NewsCard';

export default function FeatureNews() {
  return (
    <div className="mx-auto max-w-md px-4 py-4">
      <h1 className="mb-4 text-2xl font-bold text-foreground">Новости</h1>
      <div className="grid gap-4">
        {MOCK_NEWS.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
