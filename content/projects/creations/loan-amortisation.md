{
    "title":"Loan Amortisation Calculator",
    "link":"https://github.com/nealedj/loan-amortisation-rust",
    "image":"/img/loan-amortisation-snip.png",
    "description":"Loan amortisation schedules in Rust, compiled to WebAssembly and run entirely in the browser.",
    "tags":["Rust", "WASM"],
    "featured":true
}

I built this to get hands-on with Rust and WebAssembly - running a financial calculation entirely in the browser, with no server involved, felt like a well-scoped problem to learn on. Rust suited it well, and compiling to WASM means it runs anywhere a browser does. The maths isn't complicated; the interesting part was the toolchain.

This application calculates loan amortisation schedules. It uses a root finding algorithm to find the optimum monthly payment. Supports all of the common interest calculation methods.

Also compiled to a WASM binary and testable via a [simple web frontend](https://nealedj.github.io/loan-amortisation-rust/).

{{< iframe src="https://nealedj.github.io/loan-amortisation-rust/" height="1000" >}}
