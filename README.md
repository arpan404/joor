## Notice

This project is currently under active development. We will be releasing the alpha version soon, before the 2nd week of 2025. Stay tuned! If you want to contribute, you can help by testing and reporting issues.

### How to Contribute

1. **Fork and Clone the Repo**
2. **Install Packages**
    ```sh
    npm install
    ```
3. **Create a Release Version**
    - You will be asked to enter a version name: use the `0.0.1-ax` pattern or `0.0.1` pattern.
4. **Change Directory to Release Folder**
    ```sh
    cd release
    ```
5. **Run npm link**
    ```sh
    npm link
    ```
6. **Navigate to Playground**
    ```sh
    cd dev/playgrounds/ground1
    ```
7. **Link joor**
    ```sh
    npm link joor
    ```
8. **Start the Server**
    ```sh
    npm start
    ```

You can explore and test the functionalities of joor. Benchmark it against `ground0` containing Express and report any performance issues if joor is slower than Express.

### Reporting Issues and Feature Requests

- For bugs or issues, create an issue in the repository.
- For feature requests, include `#FeatureRequest` in the issue title.
- For benchmark insights, include `#Benchmark` in the issue title.
- For bug reporting, include `#Bug` in the issue title.

Thank you for contributing!
