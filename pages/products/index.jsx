import Head from 'next/head'
import { useState, useEffect } from 'react'
import { getCategories, getItems, getMatrixItems } from '../api/lightspeed'
import { FaArrowCircleUp } from 'react-icons/fa';

import Layout from '../../components/Layout'
import ProductCard from '../../components/ProductCard'
import CategoryFilter from '../../components/CategoryFilter'
import MobileCategoryFilter from '../../components/MobileCategoryFilter'

const Products = (props) => {
  const { singleItems } = props
  const { ItemMatrix } = props.matrixItems
  const { Category } = props.categories
  const items = [...singleItems, ...ItemMatrix]

  const [checkedCategories, setCheckedCategories] = useState({})
  const [showScroll, setShowScroll] = useState()
  const [showFilter, setShowFilter] = useState(false)

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 200) {
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 200) {
      setShowScroll(false)
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
  }, [showScroll])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (event) => {
    setCheckedCategories({ ...checkedCategories, [event.target.value]: event.target.checked })
  }

  const handleMobileInputChange = (event) => {
    setCheckedCategories({ [event.target.value]: true })
  }

  return (
    <Layout title="Products">
      <Head>
        <title>Shop | FAB Defense (UK)</title>
        <meta name="description" content="Shop FAB Defense Products, Filter by Category"></meta>
        <meta name="robots" content="index, follow"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta name="keywords" content="fab defense, buttstocks, mounts, rails, grips, foregrips, gun accessories, rifle accessories, pistol accessories, hand guards"></meta>
        <meta property="og:title" content="Shop | FAB Defense (UK) Ltd"></meta>
        <meta property="og:description" content="Shop FAB Defense Products, Filter by Category"></meta>
        <meta property="og:image" content="/logos/FAB-logo.webp" alt="FAB Defense | Expect More"></meta>
        <meta property="og:url" content="https://fabdefense.co.uk/products"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta charSet="UTF-8"></meta>
      </Head>
      <div className="lg:flex lg:mx-60 lg:mt-8">
        <FaArrowCircleUp
          className="scrollTop lg:text-4xl text-3xl"
          onClick={scrollTop}
          style={{
            height: 40,
            display: showScroll ? 'flex' : 'none',
            position: 'fixed',
            bottom: '30px',
            right: '16px',
          }}
        />
        <div className="lg:hidden">
          <MobileCategoryFilter category={Category} handleMobileInputChange={handleMobileInputChange} checkedCategories={checkedCategories} />
        </div>
        <div className="hidden lg:block lg:w-1/4">
          <CategoryFilter category={Category} handleInputChange={handleInputChange} checkedCategories={checkedCategories} />
        </div>
        <div className="lg:w-3/4 flex flex-col">
          <div className="mx-auto my-8 w-80 lg:w-full lg:grid lg:grid-cols-3 lg:gap-4 lg:my-12 lg:flex lg:justify-center">
            {items.map(item => {
              if (Object.keys(checkedCategories).length < 1 || Object.keys(checkedCategories).every(value => checkedCategories[value] === false)) {
                if (item.ItemECommerce.listOnStore == 'true') {
                  return <ProductCard item={item} key={item.itemID ? item.itemID : item.itemMatrixID} />
                }
              }
              for (const [key, value] of Object.entries(checkedCategories)) {
                if (value === true) {
                  if (item.categoryID === key) {
                    if (item.ItemECommerce.listOnStore == 'true') {
                      return <ProductCard item={item} key={item.itemID ? item.itemID : item.itemMatrixID} />
                    }
                  }
                }
              }
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Get Item Data
  const itemData = await getItems()
  const items = await itemData.data

  // Get Matrix Items
  const matrixItemData = await getMatrixItems()
  const matrixItems = await matrixItemData.data

  // Filter Single Items
  let singleItems = []

  items.Item.map(item => {
    if (item.itemMatrixID == 0) {
      singleItems.push(item)
    }
  })

  // Get & Sort Category Data
  const categoriesToFetch = []

  const findCategories = items.Item.map(item => {
    categoriesToFetch.push(item.categoryID)
  })

  const categoryData = await getCategories(categoriesToFetch)
  const categories = await categoryData.data

  return {
    props: {
      singleItems,
      matrixItems,
      categories
    }
  }
}

export default Products;