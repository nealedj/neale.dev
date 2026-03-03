{
    "title":"Loan Amortisation Calculator",
    "link":"https://github.com/nealedj/loan-amortisation-rust",
    "image":"/img/loan-amortisation-snip.png",
    "description":"A loan schedule calculator",
    "tags":["Rust", "WASM"],
    "featured":true
}

I built this to get hands-on with Rust and WebAssembly - running a financial calculation entirely in the browser, with no server involved, felt like a well-scoped problem to learn on. It turns out Rust is very well-suited to this kind of thing, and WASM makes the result genuinely portable. The maths isn't complicated; the interesting part was the toolchain.

This application calculates loan amortisation schedules. It uses a root finding algorithm to find the optimum monthly payment. Supports all of the common interest calculation methods.

Also compiled to a WASM binary and testable via a [simple web frontend](https://nealedj.github.io/loan-amortisation-rust/).

{{< iframe src="https://nealedj.github.io/loan-amortisation-rust/" height="1000" >}}
