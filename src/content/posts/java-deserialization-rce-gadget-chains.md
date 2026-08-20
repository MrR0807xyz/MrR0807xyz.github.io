---
title: "Deep Dive into Java Deserialization RCE & Gadget Chain Engineering"
description: "In-depth technical breakdown of Java ObjectInputStream deserialization vulnerabilities, Apache Commons Collections gadget chain construction, and runtime mitigations."
pubDate: "2024-05-02"
author: "Abubakar Jamilu Bashir"
categories: ["CVE Research", "Web Security", "Binary & Java"]
tags: ["java", "deserialization", "cve", "gadget-chain", "rce", "research"]
pin: false
severity: "Critical"
cvss: "9.8"
---
# Introduction

Insecure deserialization remains one of the most impactful vulnerability classes in enterprise applications. When untrusted input is passed directly to Javas `ObjectInputStream.readObject()`, attackers can trigger arbitrary code execution by orchestrating a chain of benign existing classes on the application classpath—commonly referred to as a **Gadget Chain**.

---

## Anatomy of a Gadget Chain (Apache Commons Collections)

The classic `CommonsCollections1` gadget chain leverages Java reflection and `LazyMap` transformations:

```
[ObjectInputStream.readObject()]
          │
          ▼
   AnnotationInvocationHandler.readObject()
          │
          ▼
   Map.entrySet() (triggers dynamic proxy invoke)
          │
          ▼
   LazyMap.get()
          │
          ▼
   ChainedTransformer.transform()
          │
          ├─► ConstantTransformer.transform(Runtime.class)
          ├─► InvokerTransformer("getMethod", ["getRuntime", []])
          ├─► InvokerTransformer("invoke", [])
          └─► InvokerTransformer("exec", ["/bin/sh -c ..."])
```

---

## Vulnerable Java Endpoint Example

Consider a legacy enterprise endpoint receiving serialized session tokens:

```java
// Vulnerable Spring Controller
@PostMapping("/api/v1/session/restore")
public ResponseEntity<String> restoreSession(@RequestBody byte[] serializedData) {
    try {
        ByteArrayInputStream bais = new ByteArrayInputStream(serializedData);
        ObjectInputStream ois = new ObjectInputStream(bais);
        
        // VULNERABLE: Direct deserialization of untrusted user bytes
        UserSession session = (UserSession) ois.readObject();
        return ResponseEntity.ok("Session restored: " + session.getUsername());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error deserializing session.");
    }
}
```

---

## Bytecode Magic Byte Identification

Java serialized objects always begin with the magic 4-byte header `0xAC 0xED 0x00 0x05` (Base64: `rO0AB...`).

```http
POST /api/v1/session/restore HTTP/1.1
Host: internal-portal.corp.local
Content-Type: application/octet-stream

rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUrMpBMBACFAAK...
```

---

## Defensive Engineering & Modern Mitigation

### 1. Replace Native Java Deserialization
Migrate away from `ObjectInputStream` entirely in favor of safe data interchange formats such as **JSON** (via Jackson/Gson) or **Protocol Buffers**:

```java
// Safe Deserialization using Jackson JSON
ObjectMapper mapper = new ObjectMapper();
UserSession session = mapper.readValue(jsonData, UserSession.class);
```

### 2. Implement JEP 290 Serial Filter (ObjectInputFilter)
If native deserialization is unavoidable, configure an explicit class allowlist filter:

```java
ObjectInputFilter filter = ObjectInputFilter.Config.createFilter(
    "com.corp.model.UserSession;!*" // Allow ONLY UserSession, block everything else
);
ois.setObjectInputFilter(filter);
```

### 3. Update Vulnerable Libraries
Upgrade Apache Commons Collections to `>= 3.2.2` or `>= 4.1`, where `InvokerTransformer` serialization has been disabled by default.
