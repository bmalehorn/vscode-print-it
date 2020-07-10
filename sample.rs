use std::collections::HashMap;

fn main() {
  // Statements here are executed when the compiled binary is called

  // Print text to the console
  let x = 5;
  println!("x = {:?}", x);
  let mut hash = HashMap::new();
  hash.insert("Daniel", "798-1364");
  println!("hash {:?}", hash);
}
