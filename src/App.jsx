import { useRef, useState } from 'react';
import product from './data';
import './App.css';

function App() {
  const [products, setProducts] = useState(product);
  const [cart, setCart] = useState([]);
  const [isStart, setIsStart] = useState(true); // Changed to true to show cart initially
  const dialogRef = useRef(null);

  function addCart(id) {
    const productItem = products.find(x => x.id === id);

    if (cart.find(x => x.id === productItem.id)) {
      cart.find(x => x.id === productItem.id).count++;
      setCart([...cart])
    } else {
      setCart([...cart, { ...productItem, count: 1 }])
    }
  }
  
  function deleteToCart(id) {
    if (cart.find((x) => x.id === id && x.count > 1)) {
      cart.find(x => x.id === id).count--;
      setCart([...cart]);
    } else {
      setCart(cart.filter(x => x.id !== id)); // Fixed comparison operator
    }
  }
  
  function getTotal() {
    let total = 0;
    cart.map((x) => total += x.count * x.price)
    return total;
  }
  
  function getSum() {
    return cart.reduce((total, item) => total + item.count, 0);
  }

  function handleClick() {
    dialogRef.current.showModal();
  }
  
  function handleStart() {
    dialogRef.current.close();
    setIsStart(true);
    setCart([]);
  }
  
  return (
    <div className="container">
      <div className="header">
        <h1>Desserts</h1>
      </div>
      <div className="hero">
        <div className="cards">
          {products.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              category={item.category}
              img={item.img}
              addToCart={addCart}
              deleteToCart={deleteToCart}
              cart={cart}
            />
          ))}
        </div>

        <div className="YourCart">
          {/* Always show the cart header and empty placeholder */}
          <h4>Your Cart ({getSum()})</h4>
          {getSum() === 0 && <img src="./img/Empty-Placeholder.png" className="emptyPlaceholder" />}

          {cart.length > 0 && (
            <>
              {cart.map((item) => (
                <div className="cartItem" key={item.id}>
                  <h2>{item.name}</h2>
                  <div className="dessertAmount">
                    <span className='cc'>{item.count}x</span>
                    <span className='cp'>@ ${item.price}</span>
                    <span className='ct'>${item.count * item.price}</span>
                  </div>
                </div>
              ))}
              <div className="orderTotal">
                <p>Order Total</p>
                <h4>${getTotal()} </h4>
              </div>
              <img src="./img/Info.svg" className='info' />
              <button className='confirmBtn' onClick={handleClick}>Confirm Order</button>
              <dialog ref={dialogRef}>
                <img src="./img/confirmed.svg" />
                <button className='startBtn' onClick={handleStart}>Start New Order</button>
              </dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Card Component
function Card({ id, name, price, category, img, addToCart, deleteToCart, cart }) {
  let isInCart = cart.find((x) => x.id === id);
  return (
    <div className="card">
      <img src={img} alt={name} />
      <div className={`btnGroup ${isInCart && "active"}`}>
        {isInCart ? (
          <>
            <button className="dec" onClick={() => deleteToCart(id)}>-</button>
            <span>{isInCart.count}</span>
            <button className="inc" onClick={() => addToCart(id)}>+</button>
          </>
        ) : (
          <button onClick={() => addToCart(id)} className="add-to-cart-btn">
            <img src="./img/shopping-cart-plus.png" alt="Add to cart" />
            Add to Cart
          </button>
        )}
      </div>
      <p>{category}</p>
      <h6>{name}</h6>
      <span>$ {price}</span>
    </div>
  );
}

export default App;