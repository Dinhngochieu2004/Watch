import classNames from 'classnames/bind';
import styles from './CardBody.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function CardBody({ item }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('imageContainer')}>
                {item?.discount > 0 && <span className={cx('discountBadge')}>-{item?.discount}%</span>}
                <Link to={`/product/${item?._id}`}>
                    <img
                        src={`${import.meta.env.VITE_URL_IMAGE_API}/${item?.images.split(',')[0]}`}
                        alt={item?.nameProduct}
                    />
                </Link>
            </div>

            <div className={cx('content')}>
                <h3 className={cx('title')}>{item?.nameProduct}</h3>
                <div className={cx('priceContainer')}>
                    <span className={cx('currentPrice')}>
                        {(item?.discount
                            ? item?.price - (item?.discount * item?.price) / 100
                            : item?.price
                        )?.toLocaleString()}
                        đ
                    </span>
                    {item?.discount > 0 && <span className={cx('originalPrice')}>{item?.price.toLocaleString()}đ</span>}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                    {item?.soldCount >= 0 && <p className={cx('soldInfo')}>Đã bán {item?.soldCount}</p>}
                    <p className={cx('soldInfo')}>Số lượng trong kho : {item?.stock}</p>
                </div>
            </div>
        </div>
    );
}

export default CardBody;
