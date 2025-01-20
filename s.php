import requests


API_URL = "https://<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>.myshopify.com/admin/api/2023-10/graphql.json"
ACCESS_TOKEN = "<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>"

# GraphQL query
query = """
query GetProductVariants {
  product(id: "gid://shopify/Product/108828309") {
    title
    variants(first: 10) {
      edges {
        node {
          id
          title
          inventoryQuantity
          price
        }
      }
    }
  }
}
"""

# Send the request
headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": ACCESS_TOKEN,
}
response = requests.post(API_URL, json={"query": query}, headers=headers)

# Parse and print the response
if response.status_code == 200:
    print(response.json())
else:
    print(f"Error {response.status_code}: {response.text}")