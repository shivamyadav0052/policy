FROM maven:3.8.1-openjdk-17-slim AS builder
WORKDIR /build
COPY policy-sphere-backend-springboot/pom.xml .
RUN mvn dependency:go-offline
COPY policy-sphere-backend-springboot/src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /build/target/insurance-policy-management-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 10000
CMD ["java", "-jar", "app.jar"]
