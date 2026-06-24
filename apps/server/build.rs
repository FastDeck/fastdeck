fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]")
        .compile(
            &[
                "../../protos/proto/services/action.proto",
                "../../protos/proto/services/deck.proto",
            ],
            &["../../protos/proto"],
        )?;
    Ok(())
}
