# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#
# Use bash explicitly in this Makefile to avoid unexpected platform
# incompatibilities among Linux distros.
#
SHELL := /bin/bash

PLUGIN_VERSION := 0.0.1
PLUGIN_NAME := camel-openshift-console-plugin
PLUGIN_NAMESPACE := camel-tooling
PLUGIN_IMAGE := quay.io/camel-tooling/camel-openshift-console-plugin

# Replace SNAPSHOT with the current timestamp
DATETIMESTAMP=$(shell date -u '+%Y%m%d-%H%M%S')
VERSION := $(subst -SNAPSHOT,-$(DATETIMESTAMP),$(VERSION))


#
# =======================
# Override-able Variables
# =======================
#

#
# the namespace, image name and version for the plugin
#

CUSTOM_PLUGIN_NAMESPACE ?= $(PLUGIN_NAMESPACE)
CUSTOM_PLUGIN_IMAGE ?= $(PLUGIN_IMAGE)
CUSTOM_PLUGIN_VERSION ?= $(PLUGIN_VERSION)



#
# =======================
# Environment Checks
# =======================
#


yarn:
ifeq (, $(shell command -v yarn 2> /dev/null))
	$(error "No yarn found in PATH. Please install and re-run")
endif

podman:
ifeq (, $(shell command -v podman 2> /dev/null))
	$(error "No podman found in PATH. Please install and re-run")
endif

oc:
ifeq (, $(shell command -v oc 2> /dev/null))
	$(error "No oc found in PATH. Please install and re-run")
endif

helm:
ifeq (, $(shell command -v helm 2> /dev/null))
	$(error "No helm found in PATH. Please install and re-run")
endif

.PHONY: yarn podman oc helm

#
# =========================
# Development and Building
# =========================
#

# TODO licence, format, and lint-fix

#---
#
#@ plugin-setup
#
#== Sets up yarn by installing all dependencies
#
#=== Calls: yarn
#
#---
plugin-setup: yarn
	@echo "####### Setup $(PLUGIN_NAME) ..."
	cd plugin && yarn install

#---
#
#@ plugin-lint
#
#== Executes linting of all source code
#
#=== Calls: setup
#
#---
plugin-lint: plugin-setup
	@echo "####### Linter $(PLUGIN_NAME) ..."
	cd plugin && yarn lint

#---
#
#@ plugin-build
#
#== Performs a local build of the console plugin
#
#=== Calls: plugin-setup
#
#---
plugin-build: plugin-setup
	@echo "####### Building $(PLUGIN_NAME) ..."
	cd plugin && yarn build

#---
#
#@ plugin-build-dev
#
#== Performs a local build dev mode of the console plugin
#
#=== Calls: plugin-setup
#
#---
plugin-build-dev: plugin-setup
	@echo "####### Building $(PLUGIN_NAME) ..."
	cd plugin && yarn build-dev

#---
#
#@ plugin-image
#
#== Executes a local build of the production container images
#
#=== Calls: podman
#
#* PARAMETERS:
#** CUSTOM_PLUGIN_IMAGE:     Set a custom plugin image to install from
#** CUSTOM_PLUGIN_VERSION:   Set a custom plugin image version to install from
#
#---
plugin-image: podman
	podman build -t $(CUSTOM_PLUGIN_IMAGE):$(CUSTOM_PLUGIN_VERSION) plugin

#---
#
#@ push-plugin
#
#== Pushes the locally build image to the registry
#
#=== Calls: podman
#
#* PARAMETERS:
#** CUSTOM_PLUGIN_IMAGE:     Set a custom plugin image to install from
#** CUSTOM_PLUGIN_VERSION:   Set a custom plugin image version to install from
#
#---
push-plugin: podman
	podman push --tls-verify=false $(CUSTOM_PLUGIN_IMAGE):$(CUSTOM_PLUGIN_VERSION) 

.PHONY: plugin-setup plugin-build plugin-build-dev plugin-image

#
# ============================
# Installation and Deployment
# ============================
#



#---
#
#@ deploy-plugin
#
#== Install the plugin into an OCP cluster
#
#=== Calls: oc, helm
#
#* PARAMETERS:
#** CUSTOM_PLUGIN_NAMESPACE: Set a custom namespace to install to
#** CUSTOM_PLUGIN_IMAGE:     Set a custom plugin image to install from
#** CUSTOM_PLUGIN_VERSION:   Set a custom plugin image version to install from
#
#---
deploy-plugin: oc helm
	./bin/camel-install-openshift-console-plugin --namespace $(CUSTOM_PLUGIN_NAMESPACE) --image $(CUSTOM_PLUGIN_IMAGE):$(CUSTOM_PLUGIN_VERSION)

#---
#
#@ undeploy
#
#== Install the plugin into an OCP cluster
#
#=== Calls: helm
#
#* PARAMETERS:
#** CUSTOM_PLUGIN_NAMESPACE: Set a custom namespace to uninstall from
#
#---
undeploy: helm
	helm uninstall $(PLUGIN_NAME) --namespace=$(CUSTOM_PLUGIN_NAMESPACE)

all: plugin-image push-plugin deploy-plugin

help: ## Show this help screen.
	@awk 'BEGIN { printf "\nUsage: make \033[31m<PARAM1=val1 PARAM2=val2>\033[0m \033[36m<target>\033[0m\n"; printf "\nAvailable targets are:\n" } /^#@/ { printf "\033[36m%-15s\033[0m", $$2; subdesc=0; next } /^#===/ { printf "%-14s \033[32m%s\033[0m\n", " ", substr($$0, 5); subdesc=1; next } /^#==/ { printf "\033[0m%s\033[0m\n\n", substr($$0, 4); next } /^#\*\*/ { printf "%-14s \033[31m%s\033[0m\n", " ", substr($$0, 4); next } /^#\*/ && (subdesc == 1) { printf ""; next } /^#\-\-\-/ { printf "\n"; next }' $(MAKEFILE_LIST)
	

.DEFAULT_GOAL := help
default: help

.PHONY: deploy-plugin undeploy all help