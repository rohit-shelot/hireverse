# Build stage using a modern, reliable Maven image with caching optimization
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies to cache this layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Run stage using a stable JRE image
FROM eclipse-temurin:17-jre
WORKDIR /app

# Create a non-root user for improved security in cloud environments
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy only the built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Standard port for Spring Boot
EXPOSE 8081

# Optimize JVM for cloud/container environments
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
