import Link from 'next/link'
import slugify from 'slugify'
import Image from 'next/image'

const ProductCard = (props) => {
  const { item } = props
  const name = item.description
  const slug = slugify(item.description)

  return (
    <>
      <div className="lg:mx-8 lg:my-8 lg:w-64 lg:overflow-hidden flex flex-col rounded lg:shadow-lg">
        <Link href={`/products/[id]?id=${item.itemID}`}>
          <a>
            <div className="lg:flex lg:justify-center">
              {item.Images &&
                <Image
                  src={`${item.Images.Image.baseImageURL}/w_250/${item.Images.Image.publicID}.jpg`}
                  alt={`Photo of ${item.description.image}`}
                  width={250}
                  height={250}
                />}
            </div>
            <div className="lg:p-4 bg-black text-white font-bold uppercase">
              <h2>{item.description}</h2>
              <p className="lg:mt-4 lg:text-lg">£{item.Prices.ItemPrice[0].amount}</p>
            </div>
          </a>
        </Link>
      </div >
    </>
  )
}

export default ProductCard