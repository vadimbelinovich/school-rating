import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next';
import { withLayout } from '../../layout/Layout';
import { MenuItem } from '../../interfaces/menu.interface';
import { TopPageModel } from '../../interfaces/page.interface';
import { ProductModel } from '../../interfaces/product.interface';
import { ParsedUrlQuery } from 'querystring';
import axios from 'axios';
const firstCategory = 0;

function Course({ products }: CourseProps): JSX.Element {

	return (
		<>
      {products && products.length}
		</>
	);
}

export default withLayout(Course);

export const getStaticPaths: GetStaticPaths = async () => {
	// let paths: string[] = [];
	// for (const m of firstLevelMenu) {
    const { data: menu } = await axios.post<MenuItem[]>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/top-page/find`, {
      firstCategory
    });
	// 	paths = paths.concat(menu.flatMap(s => s.pages.map(p => `/${m.route}/${p.alias}`)));
	// }
	return {
		paths: menu.flatMap(s => s.pages.map(p => `/courses/${p.alias}`)),
		fallback: true
	};
};

export const getStaticProps: GetStaticProps<CourseProps> = async ({params}: GetStaticPropsContext<ParsedUrlQuery>) => {
  if (!params) {
		return {
			notFound: true
		};
	}
	const { data: menu } = await axios.post<MenuItem[]>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/top-page/find`, {
		firstCategory
	});
  if (menu.length == 0) {
    return {
      notFound: true
    };
  }
  const { data: page } = await axios.get<TopPageModel>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/top-page/byAlias/${params.alias}`);
  const { data: products } = await axios.post<ProductModel[]>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/product/find`, {
    category: page.category,
    limit: 10
  });

	return {
		props: {
			menu,
			firstCategory,
      page,
      products
		}
	};
};

interface CourseProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: number;
  page: TopPageModel;
  products: ProductModel[];
}
