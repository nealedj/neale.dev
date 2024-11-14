{
    "title":"Loan Amortisation Calculator",
    "link":"https://github.com/nealedj/loan-amortisation-rust",
    "image":"/img/loan-amortisation-snip.png",
    "description":"A loan schedule calculator",
    "tags":["Rust", "WASM"],
    "featured":true
}

This application calculates loan amortisation schedules. It uses a root finding algorithm to find the optimum monthly payment. Supports all of the common interest calculation methods.

It was written as a curiosity exercise to learn Rust.

Also compiled to a WASM binary and testable via a [simple web frontend](https://nealedj.github.io/loan-amortisation-rust/).

{{< iframe src="https://nealedj.github.io/loan-amortisation-rust/" height="1000" >}}
