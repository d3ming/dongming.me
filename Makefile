# Makefile for dongming.me

# Variables
NPM := npm
BUILD_DIR := dist

.PHONY: all help install dev build preview check lint clean

all: install build

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build production site and search index"
	@echo "  make preview  - Preview production build"
	@echo "  make check    - Run linting and type checking"
	@echo "  make lint     - Run linter (Biome)"
	@echo "  make format   - Format code (Biome)"
	@echo "  make clean    - Remove build artifacts"

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

preview:
	$(NPM) run preview

check:
	$(NPM) run check

lint:
	$(NPM) run lint

format:
	$(NPM) run format

clean:
	rm -rf $(BUILD_DIR)
	rm -rf .astro
