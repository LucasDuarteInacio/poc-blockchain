import React, { Component } from "react";

class Main extends Component {
  render() {
    const handleSale = (id, saleProduct) => {
      const newSaleState = saleProduct ? false : true;
      this.props.handleSale(id, newSaleState);
    };

    const handleProduct = (id, name, price) => {
      this.productId.value = id;
      this.productName.value = name;
      this.productPrice.value = price;
      this.productName.focus();
    };

    const currentAccount = this.props.account
    return (
      <>
        <div id="content" className="container">
          <h1>Produtos</h1>
          <form
            className="form-group"
            onSubmit={event => {
              event.preventDefault();
              const id = this.productId.value;
              const name = this.productName.value;
              const sale = true;
              const price = window.web3.utils.toWei(
                this.productPrice.value.toString(),
                "Ether"
              );
              !this.productId.value
                ? this.props.createProduct(name, price, sale)
                : this.props.updateProduct(id, name, price);
            }}
          >
            <div className="row">
              <div className="col">
                <input
                  id="productName"
                  type="text"
                  ref={input => {
                    this.productName = input;
                  }}
                  className="form-control"
                  placeholder="Nome do produto"
                  required
                />
                <input
                  id="productId"
                  type="hidden"
                  ref={input => {
                    this.productId = input;
                  }}
                />
              </div>
              <div className="col">
                <input
                  id="productPrice"
                  type="text"
                  ref={input => {
                    this.productPrice = input;
                  }}
                  className="form-control"
                  placeholder="Valor(em Ether)"
                  required
                />
              </div>
              <div></div>
              <div className="col">
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </div>
          </form>
          <p>&nbsp;</p>
          <h2>Comprar produto</h2>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">Preço</th>
                <th scope="col">Proprietário</th>
                <th scope="col">À venda</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody id="productList">
              {this.props.products.map((product, key) => {
                return (
                  <tr key={key}>
                    <th scope="row">{product.id.toString()}</th>
                    <td>{product.name}</td>
                    <td>
                      {window.web3.utils.fromWei(
                        product.price.toString(),
                        "ether"
                      )}{" "}
                      Eth
                    </td>
                    <td>{product.owner}</td>
                    <td>
                    {((currentAccount === product.owner)) ? (
                      <input
                        checked={product.sale ? true : false}
                        className="form-check-input"
                        type="checkbox"
                        ref={input => {
                          this.saleProduct = input;
                        }}
                        onChange={() =>
                          handleSale(product.id.toString(), product.sale)
                        }
                      />
                    ):''}
                    </td>
                    <td>
                      <div className="row">
                        <div className="col">
                          {(product.sale && (currentAccount !== product.owner)) ? 
                            <button
                              className="btn btn-success"
                              name={product.id}
                              value={product.price}
                              onClick={event => {
                                this.props.purchaseProduct(
                                  event.target.name,
                                  event.target.value
                                );
                              }}
                            >
                              Comprar
                            </button>
                           : null}
                        </div>
                        <div className="col">
                          {((currentAccount === product.owner)) ? (
                            <button
                              className="btn btn-info"
                              name={product.id}
                              value={product.price}
                              onClick={() =>
                                handleProduct(
                                  product.id,
                                  product.name,
                                  window.web3.utils.fromWei(
                                    product.price.toString()
                                  )
                                )
                              }
                            >
                              Editar
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <div></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <footer className="text-center p-4">
            <p>
              <a
                href="https://rinkeby.etherscan.io/address/0x737B13477e7019f0695595935D0Fff3bf0d94855"
                target="_blank"
              >
                INFORMAÇÕES DO CONTRATO
              </a>
            </p>
          </footer>
        </div>
      </>
    );
  }
}

export default Main;
