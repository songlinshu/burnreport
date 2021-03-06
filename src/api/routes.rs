use crate::api::handlers::delete_single_product_handler;
use crate::api::handlers::get_single_product_handler;
use crate::api::handlers::insert_single_product_handler;
use crate::api::handlers::process_report;
use crate::api::handlers::products_csv;
use crate::api::handlers::test;
use serde_derive::{Deserialize, Serialize};
use sqlx::SqlitePool;
use warp::Filter;

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchQuery {
    pub p: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Id {
    id: String,
}

fn with_db(
    db: SqlitePool,
) -> impl Filter<Extract = (SqlitePool,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || db.clone())
}

pub fn routes(
    pool: SqlitePool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    // GET / -> index.html
    let index = warp::get()
        .and(warp::path::end())
        .and(warp::fs::file("./frontend/build/index.html"));
    
    let products = warp::get().and(warp::path!("products")).and(warp::fs::file("./frontend/build/index.html"));
    let products_add = warp::get().and(warp::path!("products" / "add")).and(warp::fs::file("./frontend/build/index.html"));

    let frontend = index.or(products).or(products_add);

    //  GET /...
    // e.g. /favicon.ico -> favicon.ico
    // e.g. /static/js/main.chunk.js -> /static/js/main.chunk.js
    let assets = warp::get().and(warp::fs::dir("./frontend/build"));

    frontend.or(get_search_product(pool.clone()))
        .or(get_single_product(pool.clone()))
        .or(assets)
        .or(post_report(pool.clone()))
        .or(post_new_product(pool.clone()))
        .or(delete_single_product(pool.clone()))
        .or(post_products_csv(pool))
}

fn get_search_product(
    pool: SqlitePool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "search")
        .and(warp::get())
        .and(with_db(pool))
        .and(warp::query::<SearchQuery>())
        .and_then(test)
}

fn get_single_product(
    pool: SqlitePool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "products" / i32)
        .and(warp::get())
        .and(with_db(pool))
        .and_then(get_single_product_handler)
}

fn post_report(
    pool: SqlitePool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "report")
        .and(warp::post())
        .and(with_db(pool))
        // Only accept bodies smaller than 16kb...
        // .and(warp::body::content_length_limit(1024 * 16))
        .and(warp::body::json())
        .and_then(process_report)
}

fn post_new_product(
    pool: SqlitePool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "products")
        .and(warp::post())
        .and(with_db(pool))
        // Only accept bodies smaller than 16kb...
        // .and(warp::body::content_length_limit(1024 * 16))
        .and(warp::body::json())
        .and_then(insert_single_product_handler)
}

fn delete_single_product(
    pool: SqlitePool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "products" / i32)
        .and(warp::delete())
        .and(with_db(pool))
        .and_then(delete_single_product_handler)
}

fn post_products_csv(
    pool: SqlitePool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "products" / "csv")
        .and(warp::post())
        // .and(warp::filters::header::exact("Content-Type", "text/csv"))
        .and(warp::filters::multipart::form())
        .and(with_db(pool))
        .and_then(products_csv)
}
