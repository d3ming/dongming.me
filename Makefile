# Makefile for dongming.me

# Variables
NPM := npm
BUILD_DIR := dist

.PHONY: all help install dev build preview check lint clean

all: install build lint

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build production site and search index"
	@echo "  make preview  - Preview production build"
	@echo "  make lint     - Run all quality checks (SEO + Code + Formatting)"
	@echo "  make clean    - Remove build artifacts"

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

preview:
	$(NPM) run preview

lint:
	$(NPM) run lint

clean:
	rm -rf $(BUILD_DIR)
	rm -rf .astro
